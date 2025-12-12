const express = require('express');
const InventoryController = require('../controllers/inventoryController');

const setInventoryRoutes = (app) => {
    const inventoryController = new InventoryController();

    app.post('/inventory/update', inventoryController.updateStock.bind(inventoryController));
    app.get('/inventory/:productId', inventoryController.getStock.bind(inventoryController));
};

module.exports = {setInventoryRoutes};