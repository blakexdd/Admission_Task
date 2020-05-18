/* module variables */
const express = require('express');
const bodyParser = require('body-parser');
var users = require('./user.js');

/* express const */
const app = express();

/* number of times user clicked on button */
var button_clicks_number = 0;

/* setting up */
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

/* rendering index page */
app.get('/', function(req, res){
	res.render('index');
})

/* processing button click */
app.post('/', function(req, res){
	/* rendering page */
	res.render('index');

	/* incrementing button clicks number */
	button_clicks_number++;

	/* if it's first click on button, creating user */
	if (button_clicks_number == 1)
		user = new users.User('vladimir');

	/* adding links to users links dict */
	user.add_link(req.body.link, '123');

	/* printing links to console */
	user.print_links();
})

app.listen(3000, function(){
	console.log('Listening on port 3000!');
})

