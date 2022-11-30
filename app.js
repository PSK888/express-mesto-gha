const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

const auth = require('./middlewares/auth');

const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

const mongoDB = 'mongodb://localhost:27017/mestodb';

const NotFoundError = require('./errors/NotFoundError');

const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening port ${PORT}`);
});

app.use(express.json());

mongoose.connect(mongoDB);

app.use('/users', auth, routerUsers);
app.use('/cards', auth, routerCards);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[\w]{1,}\.([\w\-._~:?#[\]@!$&'()*+,;=]*)/),
  }),
}), createUser);

app.use(errors());

app.use(auth, (req, res, next) => {
  next(new NotFoundError('Запрошенный ресурс не найден'));
});

app.use((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .send({ message: err.message });
  next();
});
