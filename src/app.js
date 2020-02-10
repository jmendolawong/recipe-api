require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, CLIENT_ORIGIN } = require('./config.js')

const recipesRouter = './recipes/recipes-router'

const app = express();

/***********  Middleware ***********/
app.use(helmet())
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
)

const morganSetting = NODE_ENV === 'production' ? 'tiny' : 'dev';
app.use(morgan(morganSetting))

// API validation from the client

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);

    return res.status(401).json({
      error: 'Unauthorized access'
    })
  }
  next();
})


/***********  Endpoints ***********/

app.use('/catalog', recipesRouter)





/***********  Error handling ***********/

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