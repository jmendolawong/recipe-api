const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeRecipesArray } = require('./recipes.fixtures')

describe('Recipes endpoints', function () {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('Clean table', () =>
    db.raw('TRUNCATE recipes RESTART IDENTITY')
  )

  afterEach('Clean table', () =>
    db.raw('TRUNCATE recipes RESTART IDENTITY')
  )

  /************  GET Endpoints ************/

  describe('GET /api/catalog', () => {

    context('Given no recipes in the db', () => {
      it('responds 200 and empty list', () => {
        return supertest(app)
          .get('/api/catalog')
          .expect(200, [])
      })
    })

    context('Given recipes in the db', () => {
      const testRecipes = makeRecipesArray()

      beforeEach('Seed table', () => {
        return db
          .insert(testRecipes)
          .into('recipes')
      })

      it('responds 200 and all recipes', () => {
        return supertest(app)
          .get('/api/catalog')
          .expect(200, testRecipes)
      })
    })

  })

  describe('GET /api/catalog/:id', () => {
    context('No recipe with that id', () => {
      it('responds 404', () => {
        const id = 1234
        return supertest(app)
          .get(`/api/catalog/${id}`)
          .expect(404, { error: { message: `Recipe doesn't exist` } })
      })
    })

    context('Given recipes in the database', () => {
      const testRecipes = makeRecipesArray()

      beforeEach('Seed table', () => {
        return db
          .insert(testRecipes)
          .into('recipes')
      })

      it('responds 200 and article with id', () => {
        const recipeId = 2
        const expectedRecipe = testRecipes[recipeId - 1]
        return supertest(app)
          .get(`/api/catalog/${recipeId}`)
          .expect(200, expectedRecipe)
      })
    })
  })

  /************  POST Endpoints ************/
  describe('POST /api/catalog', () => {
    it('responds 201 and inserts new recipe', () => {
      const newRecipe = {
        name: 'test name',
        note: 'test note',
        url: 'test url'
      }

      return supertest(app)
        .post('/api/catalog')
        .send(newRecipe)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.name).to.eql(newRecipe.name)
          expect(res.body.note).to.eql(newRecipe.note)
          expect(res.body.url).to.eql(newRecipe.url)
          expect(res.headers.location).to.eql(`/api/catalog/${res.body.id}`)
        })
        .then(postRes =>
          supertest(app)
            .get(`/api/catalog/${postRes.body.id}`)
            .expect(postRes.body)
        )
    })

    const requiredFields = ['name', 'url']

    requiredFields.forEach(field => {
      const newRecipe = {
        name: 'test name',
        note: 'test note',
        url: 'test url'
      }

      it('responds 400 and error message with missing required field', () => {
        delete newRecipe[field]

        return supertest(app)
          .post('/api/catalog')
          .send(newRecipe)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })
  })

  /************  DELETE Endpoints ************/

  describe('DELETE /api/catalog', () => {
    context('No recipe with that id', () => {
      it('responds 404', () => {
        const id = 1234
        return supertest(app)
          .delete(`/api/catalog/${id}`)
          .expect(404, { error: { message: `Recipe doesn't exist` } })
      })
    })

    context('Given recipes', () => {
      const testRecipes = makeRecipesArray()

      beforeEach('Seed table', () => {
        return db
          .insert(testRecipes)
          .into('recipes')
      })

      it('responds 204 and the remaining articles', () => {
        const id = 2
        const remainingRecipes = testRecipes.filter(recipe => recipe.id !== id)
        return supertest(app)
          .delete(`/api/catalog/${id}`)
          .expect(204)
          .then(res => {
            supertest(app)
              .get(`/api/catalog`)
              .expect(remainingRecipes)
          })
      })
    })
  })

})