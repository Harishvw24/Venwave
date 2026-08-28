const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.end('Hello, World. Development of Venwave SaaS is in progress. Stay tuned for updates!\n');
});

server.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
