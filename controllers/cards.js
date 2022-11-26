const Card = require('../models/card');

const {
  STATUS_CREATED,
  STATUS_OK,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch(() => res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера' });
    });
};

const deleteCardById = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => new Error('NotFound'))
    .then((card) => res.status(STATUS_OK).send(card.remove(), { message: 'Карточка удалена.' }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((card) => { res.status(STATUS_CREATED).send({ data: card }); })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка. ' });
      } if (err.message === 'NotFound') {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена.' });
      }
      return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((card) => { res.status(STATUS_OK).send({ data: card }); })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятии лайка. ' });
      } if (err.message === 'NotFound') {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена.' });
      }
      return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера' });
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
