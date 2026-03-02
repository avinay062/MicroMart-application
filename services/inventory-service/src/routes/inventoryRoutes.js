const express = require('express');
const InventoryController = require('../controllers/inventoryController');
const { catchAsync } = require('shared-utils');

const setInventoryRoutes = (app) => {
    const inventoryController = new InventoryController();
    const router = express.Router();
    const wrap = (handler) => catchAsync(handler.bind(inventoryController));

    router.post('/inventory/update', wrap(inventoryController.updateStock));
    router.get('/inventory/:productId', wrap(inventoryController.getStock));

    app.use('/', router);
};

module.exports = { setInventoryRoutes };