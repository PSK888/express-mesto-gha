const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const DataError = require('../errors/DataError');
const RightsError = require('../errors/RightsError');

const {
  STATUS_CREATED,
  STATUS_OK,
} = require('../utils/constants');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => next(new NotFoundError('Карточка не найдена')))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        next(new RightsError('Нельзя удалить карточку другого пользователя'));
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => res.send(card))
          .catch(next);
      }
    })
    .catch(next)
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => { throw new NotFoundError('Карточка не найдена'); })

    .then((card) => { res.status(STATUS_OK).send({ data: card }); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError('Переданы некорректные данные для постановки лайка.'));
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => { throw new NotFoundError('Карточка не найдена'); })
    .then((card) => { res.status(STATUS_OK).send({ data: card }); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError('Переданы некорректные данные для постановки лайка.'));
      }
      next(err);
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
