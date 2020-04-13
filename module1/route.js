const fs = require('fs');   

const requestHandler = (req, res) => {
    console.log('Got here');
    const url = req.url;
    const method = req.method;
    if (url === '/') {
	res.setHeader('Content-Type', 'text/html');
	res.write('<html>')
	res.write('<head><title>My test</title></head>')
	res.write('<body><form action="/message" method="POST"><input type="text" name ="message"></input></form></body>')
	res.write('</html>')
	return res.end();
    }
    if(url === '/message' && method === 'POST'){
	const body = [];
	req.on('data', (chunk) => {
	    console.log(chunk);
	    body.push(chunk);
	});
	return req.on('end', () => {
	    const parseBody = Buffer.concat(body).toString();
	    const message = parseBody.split('=')[1];
	    fs.writeFile('message.txt', message, err => {
		res.writeHead(302, {'Location': '/'})
		return res.end();
	    });
	});
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>')
    res.write('<head><title>My test</title></head>')
    res.write('<body><h1>Hi there!</h1></body>')
    res.write('</html>')
    res.end();
}

// First option to export
//module.exports = requestHandler;

// Second option
//module.exports = {
//    request: requestHandler
//};

// Third option
module.exports.handler = requestHandler;
