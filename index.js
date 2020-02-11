// ----------------------------------
const express = require('express')
const cors = require('cors')
const pg = require('pg')
const bodyParser = require('body-parser')
// express-pino-logger attaches some listeners to the request, so that it will log when the request is completed.
const pino = require('express-pino-logger')();
// Create the server
const app = express()
const session = require('express-session');

const path = require('path')
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')))
// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'))
})


app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use(session({
    secret: 'tokenCount',
    saveUninitialized: true,
    resave: true
}));

// global session
var sess;

// configs come from standard PostgreSQL env vars
// https://www.postgresql.org/docs/9.6/static/libpq-envars.html
// put in the .env file later
const HOST = 'work-samples-db.cx4wctygygyq.us-east-1.rds.amazonaws.com'
const PORT = 5432
const DATABASE = 'work_samples'
const USER = 'readonly'
const PASSWORD = 'w2UIO@#bg532!'

// app.use(bodyParser.json())
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// )

const pool = new pg.Pool({
    user: USER,
    host: HOST,
    database: DATABASE,
    password: PASSWORD,
    port: PORT,
})

// RATE LIMITING MIDDLEWEAR FUNCTION
// using sessions to track how many times a user has made a request to an api endpoint
// allow the user to start with 20 tokens, decrement for each request
const rateLimiterMiddleware = (req, res, next) => {
    // get the request session, now can create session variables on sess i.e. sess.tokens
    //  once a session variables is set, will be able to track it. Use this as the token counting mechanism (temporary unique id and token count will persist for the duration of the session)
    sess = req.session;
    console.log(sess.id);
    console.log(sess.tokens);
    // check to see if the user already has made a request (if request session has an id)
    if (sess.tokens === undefined) {
        // console.log(`I was undefined`);
        // tokens werent assigned, give 20 tokens but remove one for this api call
        sess.tokens = 5
        // get the timestamp in seconds
        sess.timeStamp = Math.round(new Date().getTime() / 1000)
        console.log('the time is', sess.timeStamp);
        // pass on to the next fxn
        next()
    } else if (sess.tokens !== undefined && sess.tokens !== 0) {
        // console.log(`I was not undefined and not zero`);
        // tokens > 0, decrement tokens
        sess.tokens = sess.tokens - 1
        sess.timeStamp = Math.round(new Date().getTime() / 1000)
        console.log('the time is', sess.timeStamp);
        // pass on to the next fxn
        next()
    } else if (sess.tokens === 0) {
        // console.log(`I was zero`);
        const currentTimeStamp = Math.round(new Date().getTime() / 1000)
        console.log(currentTimeStamp);
        console.log(sess.timeStamp);
        const timeDifference = currentTimeStamp - sess.timeStamp
        console.log('time difference', timeDifference, 'seconds');
        if (timeDifference > 30) {
            console.log(`I waited 30 seconds`);
            sess.tokens = 5
            // pass on to the next fxn
            next()
        } else {
            res.send('You have made too many requests, please wait 30 sec from last request')
        }
    }
}

const queryHandler = (req, res, next) => {
    pool.query(req.sqlQuery).then((r) => {
        return res.json(r.rows || [])
    }).catch(next)
}

app.get('/', cors(), rateLimiterMiddleware, (req, res) => {
    sess = req.session;
    console.log(sess.id);
    res.send('Welcome to EQ Works 😎')
})

app.get('/events/hourly', cors(), rateLimiterMiddleware, (req, res, next) => {
    req.sqlQuery = `
    SELECT date, hour, events
    FROM public.hourly_events
    ORDER BY date, hour
    LIMIT 168;
  `
    return next()
}, queryHandler)

app.get('/events/daily', cors(), rateLimiterMiddleware, (req, res, next) => {
    req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
    return next()
}, queryHandler)

app.get('/stats/hourly', cors(), rateLimiterMiddleware, (req, res, next) => {
    req.sqlQuery = `
    SELECT date, hour, impressions, clicks, revenue
    FROM public.hourly_stats
    ORDER BY date, hour
    LIMIT 168;
  `
    return next()
}, queryHandler)

app.get('/stats/daily', cors(), rateLimiterMiddleware, (req, res, next) => {
    req.sqlQuery = `
    SELECT date,
        SUM(impressions) AS impressions,
        SUM(clicks) AS clicks,
        SUM(revenue) AS revenue
    FROM public.hourly_stats
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
    return next()
}, queryHandler)

app.get('/poi', cors(), rateLimiterMiddleware, (req, res, next) => {
    req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `
    return next()
}, queryHandler)

app.listen(3001, (err) => {
    if (err) {
        console.error(err)
        process.exit(1)
    } else {
        // console.log(`Running on ${process.env.PORT || 5555}`)
        console.log(`Running on ${3001}`)
    }
})

// Choose the port and start the server
// const PORT = process.env.PORT || 5000
// app.listen(PORT, () => {
//     console.log(`Mixing it up on port ${PORT}`)
// })



// last resorts
process.on('uncaughtException', (err) => {
    console.log(`Caught exception: ${err}`)
    process.exit(1)
})
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
    process.exit(1)
})