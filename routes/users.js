const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

routerUsers.get('/', getAllUsers);
routerUsers.get('/me', getUserInfo);

routerUsers.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex(),
    }),
  }),
  getUserById,
);

routerUsers.patch('/me', celebrate({
  body: Joi.object().keys({
    about: Joi.string().min(2).max(30).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

routerUsers.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/https?:\/\/(www\.)?[a-zA-Z\d\-.]{1,}\.[a-z]{1,6}([/a-z0-9\-._~:?#[\]@!$&'()*+,;=]*)/),
  }),
}), updateAvatar);

module.exports = routerUsers;
