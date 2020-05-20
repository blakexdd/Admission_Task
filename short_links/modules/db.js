/* FILE NAME: db.js
 * PROGRAMMER: VG6
 * DATE: 19.05.2020
 * Purpose: To implement
 *          interaction with db
 */

/* setting requirements */
const { MongoClient } = require('mongodb');
const users = require('./user');
const app = require('../server');
const dns = require('dns');
const nanoid = require('nanoid');

/* counter indicating number user's converts */
let number_of_users_converts = 0;

/* data base url that stores in .env file */
const databaseUrl = process.env.DATABASE;

/* connecting to mongodb database */
MongoClient.connect(databaseUrl, { useNewUrlParser: true })
    .then(client => {
        /* getting shortener data base */
        app.app.locals.db = client.db('shortener');
    })
    .catch(() => console.error('Failed to connect to the database'));

/* Converting original url to short url
 * Arguments:
 *    - database with urls and url to convert
 *        db, url
 * Returns:
 *    - status of operation
*/
function make_short_urls(db, url, user_id)
{
    /* getting shortenedURLs collection where urls locate */
    const shortenedURLs = db.collection('shortenedURLs');

    /* updating urls
    *    1. Found - update url
    *    2. Not found - update url
    */
    return shortenedURLs.findOneAndUpdate({ original_url: url, user_id : user_id},
        {
            $setOnInsert: {
                original_url: url, // original url
                short_id: nanoid.nanoid(7), // short id of original,
                user_id: user_id // user id
            },
        },
        {
            /* setting additional parameters */
            returnOriginal: false,
            upsert: true,
        }
    );
}

/* Checking if short id is in urls database
 * Arguments:
 *    - database with urls and code of short url
 *        db, url
 * Returns:
 *    - 1. True - short url in db
 *      2. False - short url not in db
*/
function checkIfShortIdExists(db, code)
{
    /* finding url in db */
    return db.collection('shortenedURLs').findOne({ short_id: code });
}

/* Implementing post request
 * Arguments:
 *    - request and response
 *        req, res
 * Returns:
 *    - None
*/
function handle_url_post(req, res)
{
    /* declaring originalURl variable for further assignments */
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
        }

        /* incrementing number of users converts  */
        number_of_users_converts++;

        /* if we spotted first convert, creting user */
        if (number_of_users_converts === 1)
            user = new users.User();


        /* database instance to further search in it for links */
        const { db } = req.app.locals;

        /* getting shorten links */
        make_short_urls(db, originalUrl.href, user.id)
            .then(result => {
                /* contains original url and short id of url */
                const doc = result.value;

                /* adding links to users links dict */
                user.add_link(doc.original_url,  'http://localhost:' + process.env.PORT + '/' + doc.short_id);

                /* printing links to console */
                user.print_links();

                /* sending original url and short id of url */
                res.json({
                    original_url: doc.original_url,
                    short_id: doc.short_id,
                    user_id: user.id
                });
            })
            .catch(console.error);
    });
}

/* Implementing get request
 * Arguments:
 *    - request and response
 *        req, res
 * Returns:
 *    - None
*/
function handle_short_id_get(req, res)
{
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

            /* getting shortenedURLs collection where urls locate */
            const shortenedURLs = db.collection('shortenedURLs');

            shortenedURLs.findOneAndUpdate({ short_id: doc.short_id },
                {$inc : {counter : 1}},        {
                    /* setting additional parameters */
                    returnOriginal: false,
                    upsert: true,
                });

            /* redirecting user to original page */
            res.redirect(doc.original_url);
        })
        .catch(console.error);
}

/* exporting functions */
exports.handle_url_post = handle_url_post;
exports.handle_short_id_get = handle_short_id_get;