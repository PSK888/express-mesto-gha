const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(200).send(card))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }))
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotFound') { res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' }); }
      else { res.status(500).send({ message: 'Произошла ошибка' }) }
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findById({ _id: req.params.cardId })
    .then(() => res.status(200).send({ message: `Карточка удалена` }))
    .catch((err) => res.status(404).send({ message: 'Карточка с указанным id не найдена.' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => { res.status(200).send({ data: card }) })
    .catch((err) => {
      if (err.message === 'NotFound') { res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка. ' }); }
      else if (err.message === 'NotValid') { res.status(404).send({ message: 'Передан несуществующий id карточки.' }) }
      else { res.status(500).send({ message: 'Произошла ошибка' }) }
    });
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => { res.status(200).send({ data: card }) })
    .catch((err) => {
      if (err.message === 'NotFound') { res.status(400).send({ message: 'Переданы некорректные данные для снятии лайка. ' }); }
      else if (err.message === 'NotValid') { res.status(404).send({ message: 'Передан несуществующий id карточки.' }) }
      else { res.status(500).send({ message: 'Произошла ошибка' }) }
    });
}