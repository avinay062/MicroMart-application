const express = require('express');
const UserController = require('../controllers/userController');
const { authenticateUser } = require('shared-utils');

const setUserRoutes = (app) => {
    const router = express.Router();
    const userController = new UserController();

    router.post('/signup', userController.signup);

    router.post('/signin', userController.signIn);

    router.get('/',authenticateUser, userController.getAllUsers);

    router.post('/logout',authenticateUser, userController.logout);

    router.get('/getUser/:id',authenticateUser, userController.getUserById);

    router.post('/auth/validate', userController.validateAuth);

    app.use('/api/users', router);
};


module.exports = {setUserRoutes};
