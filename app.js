const express = require('express');
const mongoose = require('mongoose');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const mongoDB = 'mongodb://localhost:27017/mestodb';
const app = express();

app.use((req, res, next) => {
  req.user = { _id: '6377973fe89b07b462a45935' };
  next();
});
app.use(express.json());
mongoose.connect(mongoDB);
app.use('/users', routerUsers);
app.use('/cards', routerCards);

app.listen(PORT);
