import express from 'express';
import ProductController from '../controllers/productController.js';
import { authenticateUser } from 'shared-utils';
import upload from './../middleware/upload.middleware.js';


const setProductRoutes = (app) => {
    const router = express.Router();
    const productController = new ProductController(); // Create a new instance of the class

    router.post('/create', authenticateUser, upload.single('image'), productController.createProduct.bind(productController));
    router.get('/getAllProducts', authenticateUser, productController.getAllProducts.bind(productController));
    router.get('/getProduct/:id', productController.getProduct.bind(productController));
    router.put('/update/:id',authenticateUser, upload.single('image'), productController.updateProduct.bind(productController));
    router.delete('/delete/:id', productController.deleteProduct.bind(productController));
    router.get('/products-by-category', productController.getProductsByCategory.bind(productController));
    router.get('/products-by-price-range', productController.getProductsByPriceRange.bind(productController));
    router.get('/count-by-price-range', productController.countProductsByPriceRange.bind(productController));
    router.get('/paginated', productController.getPaginatedProducts.bind(productController));
    router.post('/search-product', productController.searchProducts.bind(productController)); 

    app.use('/api/products', router);
};

export { setProductRoutes };