const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    ownerName: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    businessName: {
        type: String,
        required: true,
    },
    role: { 
    type: String, 
    default: 'owner', 
    enum: [ 'owner', 'staff'] // 'staff' kept for backward compatibility
  },
    gstNumber: {
        type: String,
        required: true,
    },
    pinCode: {
        type: Number,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        },
},
{
    timestamps: true,
}
);
// Pre-save hook to hash the password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
// Method to check if user has password (for local auth)
userSchema.methods.hasPassword = function() {
  return !!this.password;
};
// Export the model directly
const User = mongoose.model('User', userSchema);

module.exports = User;
