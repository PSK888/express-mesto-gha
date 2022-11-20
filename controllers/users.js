const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }))
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValid'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotValid') { res.status(404).send({ message: 'Пользователь по указанному id не найден.' }); }
      else { res.status(500).send({ message: 'Произошла ошибка' }) }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') { res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' }); }
      else { res.status(500).send({ message: 'Произошла ошибка' }) }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') { res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' }); }
      else if (err.message === 'NotValid') { res.status(404).send({ message: 'Пользователь с указанным id не найден.' }) }
      else { res.status(500).send({ message: 'Произошла ошибка' }) }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') { res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара. ' }); }
      else if (err.message === 'NotValid') { res.status(404).send({ message: 'Пользователь с указанным id не найден. ' }) }
      else { res.status(500).send({ message: 'Произошла ошибка' }) }
    });
};

module.exports.getUserInfo = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка yfqltysif' }))
};