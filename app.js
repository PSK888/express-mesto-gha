const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const app = express();
const mongoDB = 'mongodb://localhost:27017/mestodb';
const routes = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening port ${PORT}`);
});

app.use(express.json());

mongoose.connect(mongoDB);

app.use(routes);

app.use(errors());

app.use(errorHandler);
