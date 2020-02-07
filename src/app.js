require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, CLIENT_ORIGIN } = require('./config.js')

// Init app to express object
const app = express();

/***********  Middleware ***********/
// Helmet to hide sensitive info in res header
// To be placed *before* CORS according to bloc content
app.use(helmet())

// For cross domain access
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
)

// Logging middleware, mostly for dev env
const morganSetting = NODE_ENV === 'production' ? 'tiny' : 'dev';
app.use(morgan(morganSetting))

// Authorization
app.use(function validateBearerToken(req, res, next) {
  // Server-side
  const apiToken = process.env.API_TOKEN;
  // Client supplied
  const authToken = req.get('Authorization');

  // If client doesn't supply or the their token doesn't match
  // serverside, then error 'unauthorized access'
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({
      error: { message: 'Unauthorized access' }
    })
  }
  next();
})


/***********  Endpoints ***********/

app.get('/api/*', (req, res) => {
  res.json({ "test": "works!" });
});



/***********  Error Handling ***********/
app.use((error, req, res, next) => {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error('error');
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app