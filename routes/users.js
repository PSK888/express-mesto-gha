const routerUsers = require('express').Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserInfo,
  login,
  createUser,
} = require('../controllers/users');

routerUsers.get('/', getAllUsers);
routerUsers.get('/me', getUserInfo);
routerUsers.get('/:userId', getUserById);
routerUsers.patch('/me', updateUser);
routerUsers.patch('/me/avatar', updateAvatar);
routerUsers.post('/signin', login);
routerUsers.post('/signup', createUser);

module.exports = routerUsers;
