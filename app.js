const express = require('express');
const mongoose = require('mongoose');

const mongoDB = 'mongodb://localhost:27017/mestodb';
const app = express();
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');
const { STATUS_NOT_FOUND } = require('./utils/constants');

const { PORT = 3000 } = process.env;
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening port ${PORT}`);
});

app.use(express.json());

mongoose.connect(mongoDB);

app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', auth, routerUsers);
app.use('/cards', auth, routerCards);

app.use('*', (req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: 'Запрошенный ресурс не найден' });
});
