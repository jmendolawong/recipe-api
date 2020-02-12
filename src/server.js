const app = require('./app');
const knex = require('knex')
const { PORT, DATABASE_URL } = require('./config.js')

// create the Knex instance
const db = knex({
  client: 'pg',
  connection: DATABASE_URL
})

// attach Knex instance to app as a property called 'db'
app.set('db', db)

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
