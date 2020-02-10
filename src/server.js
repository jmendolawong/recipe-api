const app = require('./app');
const knex = require('knex')
const { PORT, DB_URL } = require('./config.js')

// create the Knex instance
const db = knex({
  client: 'pg',
  connection: DB_URL
})

// attach Knex instance to app as a property called 'db'
app.set('db', db)

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
