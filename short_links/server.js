/* FILE NAME: server.js
 * PROGRAMMER: VG6
 * DATE: 19.05.2020
 */

/* setting up requirements */
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db_behave = require('./modules/db')

/* express framework variable */
const app = express();

/* setting up parsers */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* setting up static files */
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
	/* getting path where html files located */
	const htmlPath = path.join(__dirname, 'public', 'html', 'index.html');

	/* sending path */
	res.sendFile(htmlPath);
})

app.post('/new', db_behave.handle_url_post);

app.get('/:short_id', db_behave.handle_short_id_get);

/* setting port from .env if set or 3000 */
app.set('port', process.env.PORT || 3000);

/* listening at given port */
const server = app.listen(app.get('port'), () => {
	/* logging that server runs */
	console.log(`Running at PORT ${server.address().port}`);
});

/* exporting app */
exports.app = app;