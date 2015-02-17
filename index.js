var express = require('express');
var bodyParser = require('body-parser');
var postgres = require('pg');

var pg = new postgres.Client('postgres://jacobflorian@localhost/test');

var app = express();
app.use(bodyParser.json({ type: 'application/json'}));

app.get('/', function(req, res) {});

app.post('/', function(req, res) {
	var sql = 'INSERT INTO nhlCaptains (team, captain) VALUES ($1,$2) RETURNING id';

	console.log("captured");
	var data = [
		req.body.team,
		req.body.captain
	];
	pg.query(sql, data, function(err, result) {
		if (err) {
			console.error(err);
			res.statusCode = 500;
			return res.json({
				errors: ['Failed to post info']
			});
		}

		var newCaptain = result.rows[0].id;
		var sql = 'SELECT * FROM nhlCaptains WHERE id = $1';
		pg.query(sql, [ newCaptain], function(err, result) {
			if (err) {
				console.error(err);
				res.statusCode = 500;
				return res.json({
					errors: ['Could not retrieve info after create']
				});
			}

		res.statusCode = 201;

		res.json(result.rows[0]);
		});
	});

});

pg.connect(function(err) {
	if(err){
		throw err;
	}
	app.listen(3000, function() {
		console.log("Listening on 3000");
	});	
})

