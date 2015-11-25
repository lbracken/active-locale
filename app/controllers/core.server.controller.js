exports.index = function(req, res) {
	// Render the index EJS template
	res.render('index.server.view.ejs', {
		user: JSON.stringify(req.user)
	});
};