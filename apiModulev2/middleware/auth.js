const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	console.log('Start auth');
	const authHeader = req.get('Authorization');
	if (!authHeader) {
		req.isAuth = false;
		return next();
	}
	const token = authHeader.split(' ')[1];
	let decodedToken;
	try {
		// Same secret you already used
		decodedToken = jwt.verify(token, 'secret');
	} catch (err) {
		req.isAuth = false;
		return next();
	}
	// If is undefined
	if (!decodedToken) {
		req.isAuth = false;
		return next();
	}
	req.userId = decodedToken.userId;
	req.isAuth = true;
	next();
};
