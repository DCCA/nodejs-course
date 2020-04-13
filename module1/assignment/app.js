// Core Modules
const http = require('http');
// Task
// 1. create a server with 2 routes: home and users
// 2. send basic html to every route
// 3. create a post route to create a new user and console log the new user

const app = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
	console.log('home');
	res.setHeader('Content-Type', 'text/html');
	res.write('<html>');
	res.write('<body><h1>Home</h1>');
	res.write('<form action="/create-user" method="POST"><input type="text" name="user"></input><input type="submit"></input></form>');
	res.write('</body>');
	res.write('</html>');
	return res.end();
    } else if ( url === '/users' ) {
	console.log('users');
	res.write('<html>');
	res.write('<body><ul><li>User1</li><li>User2</li><li>User3</li></ul></body>');
	res.write('</html>');
	return res.end();
    } else if (url === '/create-user' && method === 'POST') {
	console.log('create-users');
	const body = [];
	req.on('data', (chunk) => {
	    body.push(chunk);
	})
	return req.on('end', () => {
	    const parsedBody = Buffer.concat(body).toString();
	    console.log(parsedBody);
	    const user = parsedBody.split('=')[1];
	    console.log(user);
	    res.writeHead(302, {'Location': '/'});
	    return res.end();
	})
    }
});
app.listen(3000);
