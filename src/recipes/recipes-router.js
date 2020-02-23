const express = require('express')
const xss = require('xss')
const path = require('path')
const RecipesService = require('./recipes-service')

const recipesRouter = express.Router()
const bodyParser = express.json()

const REGEX_URL = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
const REGEX_NAME = /^[^\s]+(\s+[^\s]+)*$/

const sanitizeRecipe = recipe => ({
  id: recipe.id,
  name: xss(recipe.name),
  note: xss(recipe.note),
  url: xss(recipe.url),
})

recipesRouter
  .route('/')
  .get((req, res, next) => {
    RecipesService.getAllRecipes(
      req.app.get('db')
    )
      .then(recipes => {
        res.json(recipes.map(sanitizeRecipe))
      })
      .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    const { name, note, url } = req.body
    const newRecipe = { name, url }

    // Request body validation
    for (const [key, value] of Object.entries(newRecipe))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    // Input validation
    if (!name.match(REGEX_NAME)) {
      return res
        .status(401)
        .send(`Name must contain at least 1 character and not begin or end with a space`)
    }

    if(!url.match(REGEX_URL)){
      return res
        .status(401)
        .send(`Must be valid url`)
    }

    newRecipe.note = note

    RecipesService.addRecipe(
      req.app.get('db'),
      newRecipe
    )
      .then(recipe => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${recipe.id}`))
          .json(sanitizeRecipe(recipe))
      })
      .catch(next)
  })

recipesRouter
  .route('/:id')
  .all((req, res, next) => {
    RecipesService.getRecipeById(
      req.app.get('db'),
      req.params.id
    )
      .then(recipe => {
        if (!recipe) {
          return res.status(404).json({
            error: { message: `Recipe doesn't exist` }
          })
        }
        res.recipe = recipe
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(sanitizeRecipe(res.recipe))
  })
  .delete((req, res, next) => {
    RecipesService.deleteRecipe(
      req.app.get('db'),
      req.params.id
    )
      .then(() =>
        res.status(204).end()
      )
      .catch(next)
  })


module.exports = recipesRouter
