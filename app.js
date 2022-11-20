const express = require('express');
const mongoose = require('mongoose');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const app = express();

app.use((req, res, next) => {
  req.user = { _id: '6377973fe89b07b462a45935' };
  next();
});
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(routerUsers);
app.use(routerCards);


app.listen(PORT, () => { console.log(`App listening on port ${PORT}`) });