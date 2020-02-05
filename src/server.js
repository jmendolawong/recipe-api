const express = require('express');
const app = express();

 const PORT = process.env.PORT || 8000;

 app.get('/api/*', (req, res) => {
   res.json({ok: true});
 });

 app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

 module.exports = {app};