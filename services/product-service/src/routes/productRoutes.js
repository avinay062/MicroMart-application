import express from 'express';
import ProductController from '../controllers/productController.js';
import upload from './../middleware/upload.middleware.js';
import { authenticateUser, catchAsync } from 'shared-utils';


const setProductRoutes = (app) => {
    const router = express.Router();
    const productController = new ProductController();
    const wrap = (handler) => catchAsync(handler.bind(productController));

    router.post('/create', authenticateUser, upload.single('image'), wrap(productController.createProduct));
    router.get('/getAllProducts', authenticateUser, wrap(productController.getAllProducts));
    router.get('/getProduct/:id', wrap(productController.getProduct));
    router.put('/update/:id', authenticateUser, upload.single('image'), wrap(productController.updateProduct));
    router.delete('/delete/:id', wrap(productController.deleteProduct));
    router.get('/products-by-category', wrap(productController.getProductsByCategory));
    router.get('/products-by-price-range', wrap(productController.getProductsByPriceRange));
    router.get('/count-by-price-range', wrap(productController.countProductsByPriceRange));
    router.get('/paginated', wrap(productController.getPaginatedProducts));
    router.post('/search-product', wrap(productController.searchProducts)); 

    app.use('/api/products', router);
};

export { setProductRoutes };