const express = require('express');
const { PORT } = require('./config.js')

const app = express();

app.get('/api/*', (req, res) => {
  res.json({ ok: true });
});


app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

module.exports = { app };