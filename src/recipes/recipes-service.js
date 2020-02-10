const RecipesService = {
  getAllRecipes(knex) {
    return knex
      .select('*')
      .from('recipes')
  },

  getRecipeById(db, id) {
    return db
      .select('*')
      .from('recipes')
      .where({ id })
      .first()
  },

  addRecipe(db, newRecipe) {
    return db
      .insert(newRecipe)
      .into('recipes')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  deleteRecipe(db, id) {
    return db
      .delete()
      .from('recipes')
      .where({ id })
  }

}

module.exports = RecipesService