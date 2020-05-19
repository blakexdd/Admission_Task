/* FILE NAME: server.js
 * PROGRAMMER: VG6
 * DATE: 19.05.2020
 */

/* setting up requirements */
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dns = require('dns');
const { MongoClient } = require('mongodb');
const nanoid = require('nanoid');
const users = require('./instances/user');

/* data base url that stores in .env file */
const databaseUrl = process.env.DATABASE;

/* counter indicating number user's converts */
let number_of_users_converts = 0;

/* express framework variable */
const app = express();

/* setting up parsers */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* setting up static files */
app.use(express.static(path.join(__dirname, 'public')))

/* connecting to mongodb database */
MongoClient.connect(databaseUrl, { useNewUrlParser: true })
	.then(client => {
		/* getting shortener data base */
		app.locals.db = client.db('shortener');
	})
	.catch(() => console.error('Failed to connect to the database'));


const shortenURL = (db, url) => {
	/* getting shortenedURLs collection where urls locate */
	const shortenedURLs = db.collection('shortenedURLs');

	/* updating urls
	*    1. Found - update url
	*    2. Not found - update url
	*/
	return shortenedURLs.findOneAndUpdate({ original_url: url },
		{
			$setOnInsert: {
				original_url: url, // soriginal url
				short_id: nanoid.nanoid(7), // short id of original
			},
		},
		{
			/* setting additional parameters */
			returnOriginal: false,
			upsert: true,
		}
	);
};

const checkIfShortIdExists = (db, code) => db.collection('shortenedURLs')
	.findOne({ short_id: code });

app.get('/', (req, res) => {
	/* getting path where html files located */
	const htmlPath = path.join(__dirname, 'public', 'html', 'index.html');

	/* sending path */
	res.sendFile(htmlPath);
})

app.post('/new', (req, res) => {
	/* declarating originalURl variable for further assignments */
	let originalUrl;

	/* checking if user entered valid url */
	try {
		/* getting url from requests body */
		originalUrl = new URL(req.body.url);
	} catch (err) {
		/* returning error indicating that user entered invalid url */
		return res.status(400).send({error: 'invalid URL'});
	}

	/* checking if user entered working url */
	dns.lookup(originalUrl.hostname, (err) => {
		if (err) {
			/* returning error indicating user entered not working url */
			return res.status(404).send({error: 'Address not found'});
		};

		/* database instance to further search in it for links */
		const { db } = req.app.locals;

		/* getting shorten links */
		shortenURL(db, originalUrl.href)
			.then(result => {
				/* contains original url and short id of url */
				const doc = result.value;

				/* incrementing number of users converts  */
				number_of_users_converts++;

				/* if we spotted first convert, creting user */
				if (number_of_users_converts === 1)
					user = new users.User();

				/* adding links to users links dict */
				user.add_link(doc.original_url,  'http://localhost:' + process.env.PORT + '/' + doc.short_id);

				/* printing links to console */
				user.print_links();

				/* sending original url and short id of url */
				res.json({
					original_url: doc.original_url,
					short_id: doc.short_id,
				});
			})
			.catch(console.error);
	});

});

app.get('/:short_id', (req, res) => {
	/* short id of current url */
	const shortId = req.params.short_id;

	/* database to further redirection */
	const { db } = req.app.locals;

	/* checking if given short if is in data base */
	checkIfShortIdExists(db, shortId)
		.then(doc => {
			if (doc === null)
				/* sending user response of invalid link */
				return res.send('Not valid URL');

			/* redirecting user to original page */
			res.redirect(doc.original_url)
		})
		.catch(console.error);

});

/* setting port from .env if set or 3000 */
app.set('port', process.env.PORT || 3000);

/* listening at given port */
const server = app.listen(app.get('port'), () => {
	/* logging that server runs */
	console.log(`Running at PORT ${server.address().port}`);
});