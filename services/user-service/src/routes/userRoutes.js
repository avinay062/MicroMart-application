const express = require('express');
const UserController = require('../controllers/userController');
const { authenticateUser, catchAsync } = require('shared-utils');

const setUserRoutes = (app) => {
    const router = express.Router();
    const userController = new UserController();

    const wrap = (handler) => catchAsync(handler.bind(userController));

    router.post('/signup', wrap(userController.signup));
    router.post('/signin', wrap(userController.signIn));

    router.get('/', authenticateUser, wrap(userController.getAllUsers));

    router.post('/logout', authenticateUser, wrap(userController.logout));

    router.get('/getUser/:id', authenticateUser, wrap(userController.getUserById));

    router.post('/auth/validate', userController.validateAuth);

    app.use('/api/users', router);
};


module.exports = {setUserRoutes};
