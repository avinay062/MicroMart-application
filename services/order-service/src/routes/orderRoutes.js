const express = require('express');
const OrderController = require('../controllers/orderController');

const setOrderRoutes = (app) => {
    const orderController = new OrderController();

    app.post('/orders', orderController.createOrder.bind(orderController));
    app.get('/orders/:id', orderController.getOrder.bind(orderController));
    app.put('/orders/:id/status', orderController.updateOrderStatus.bind(orderController));
};

module.exports = {setOrderRoutes};