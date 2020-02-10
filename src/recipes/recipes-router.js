const express = require('express')
const xss = require('xss')
const RecipesService = require('./recipes-service')

const recipesRouter = express.Router()
//const bodyParser = express.json()

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
      .then(recipes => res.json(recipes))
      .catch(next)
  })

/*
recipesRouter
  .route(`/catalog/:recipeId`
    .get((req, res, next) => {

    })
    .delete((req, res, next) => {

    })

  */

 module.exports = recipesRouter

