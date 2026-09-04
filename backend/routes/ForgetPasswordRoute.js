const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const crypto = require('crypto');

//Node mailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

//Request to send reset password email
router.post('/', async (req, res) => {
    const { email } = req.body;
    console.log("Received email for password reset:", email);
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Generate a random token
        const token = crypto.randomBytes(32).toString('hex');
        // Save the token to the user
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();
        // Send the reset password email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            text: [
                'Hello,',
                '',
                'We received a request to reset the password for your account.',
                '',
                'To create a new password, click the link below:',
                '',
                'Reset your password:',
                `http://localhost:5005/api/users/forget-password/reset-password/${token}`,
                '',
                'This link is valid for a limited time. If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.',
                '',
                'For security reasons, please do not share this link with anyone.',
                '',
                'Best regards,',
                'The Venwave Team'
            ].join('\n')
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Verify the reset password token and update the password
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    try {
        if (!password || password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords don't match" });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

          user.password = password;

        // Clear the reset token
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
        console.log(`Password updated successfully for user: ${user.email}`);
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;