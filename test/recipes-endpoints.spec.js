const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')

describe.only('Recipes endpoings', function () {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('Clean table', () => db('recipes').truncate())

  context('Given recipes in the db', () => {
    const testRecipes = [
      {
        "id": 1, "name": "Apple Pie", "note": "I love this recipe because it has apples, pears and bananas",
        "url": "https://www.bbcgoodfood.com/recipes/collection/apple"
      },
      {
        "id": 2, "name": "Fruit Medley", "note": "I love this recipe because it has peaches, oranges and grapes",
        "url": "https://www.bbcgoodfood.com/recipes/collection/apple"
      },
      {
        "id": 3, "name": "Chicken Pot Pie", "note": "The crust is amazing!",
        "url": "https://www.bbcgoodfood.com/recipes/collection/apple"
      },
      {
        "id": 4, "name": "So Delicious", "note": "So tasty and delicious",
        "url": "https://www.bbcgoodfood.com/recipes/collection/apple"
      },
      {
        "id": 5, "name": "Good Food", "note": "Love this!!!",
        "url": "https://www.bbcgoodfood.com/recipes/collection/apple"
      },
    ];

    beforeEach('Seed table', () => {
      return db
        .insert(testRecipes)
        .into('recipes')
    })

    it('GET all recipes, responds 200 and all recipes', () => {
      return supertest(app)
        .get('/catalog')
        .expect(200)
    })
  })


})