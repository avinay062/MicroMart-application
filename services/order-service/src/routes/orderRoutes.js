const express = require('express');
const OrderController = require('../controllers/orderController');
const { catchAsync } = require('shared-utils');

const setOrderRoutes = (app) => {
    const orderController = new OrderController();
    const router = express.Router();
    const wrap = (handler) => catchAsync(handler.bind(orderController));

    router.post('/orders', wrap(orderController.createOrder));
    router.get('/orders/:id', wrap(orderController.getOrder));
    router.put('/orders/:id/status', wrap(orderController.updateOrderStatus));

    app.use('/', router);
};

module.exports = { setOrderRoutes };