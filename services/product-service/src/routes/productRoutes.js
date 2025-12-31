import express from 'express';
import ProductController from '../controllers/productController.js';
import { authenticateUser } from 'shared-utils';
import upload from './../middleware/upload.middleware.js';


const setProductRoutes = (app) => {
    const router = express.Router();
    const productController = new ProductController();

    router.post('/create', authenticateUser, upload.single('image'), productController.createProduct);
    router.get('/getAllProducts', authenticateUser, productController.getAllProducts);
    router.get('/getProduct/:id', productController.getProduct);
    router.put('/update/:id',authenticateUser, upload.single('image'), productController.updateProduct);
    router.delete('/delete/:id', productController.deleteProduct);

    app.use('/api/products', router);
};

export { setProductRoutes };