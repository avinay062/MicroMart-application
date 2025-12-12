const express = require('express');
const ProductController = require('../controllers/productController');
const { authenticateUser } = require('shared-utils');

const setProductRoutes = (app) => {
    const router = express.Router();
    const productController = new ProductController();

    router.post('/create',authenticateUser, productController.createProduct);
    router.get('/getAllProducts', authenticateUser, productController.getAllProducts);
    router.get('/getProduct/:id', productController.getProduct);
    router.put('/update/:id', productController.updateProduct);
    router.delete('/delete/:id', productController.deleteProduct);

    app.use('/api/products', router);
};

module.exports = {setProductRoutes};