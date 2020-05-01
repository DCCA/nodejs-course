const fs = require('fs');

const deleteFile = (filePath) => {
	// This deletes a file in this path
	fs.unlink(filePath, (err) => {
		if (err) {
			throw err;
		}
	});
};

module.exports = deleteFile;
