const User = require('../models/user');

const {
  STATUS_CREATED,
  STATUS_OK,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send(users))
    .catch(() => res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера ошибка' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('NotFound'))
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные.' });
      } else if (err.message === 'NotFound') {
        res.status(STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден.' });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные ' });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new Error('NotFound'))
    .then((user) => {
      res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.message === 'NotFound') {
        res.status(STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден.' });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new Error('NotFound'))
    .then((user) => { res.status(STATUS_OK).send(user); })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара. ' });
      } else if (err.message === 'NotFound') {
        res.status(STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден. ' });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера' });
      }
    });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
