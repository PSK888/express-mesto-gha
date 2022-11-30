const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const routerUsers = require('./users');
const routerCards = require('./cards');
const { REGEX } = require('../utils/constants');

router.use('/users', auth, routerUsers);
router.use('/cards', auth, routerCards);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(REGEX),
  }),
}), createUser);

router.use(auth, (req, res, next) => {
  next(new NotFoundError('Запрошенный ресурс не найден'));
});

module.exports = router;
