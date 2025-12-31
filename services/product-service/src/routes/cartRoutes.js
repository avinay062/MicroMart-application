import express from 'express';
import CartController from '../controllers/cartController.js';
import { authenticateUser } from 'shared-utils';

const setCartRoutes = (app) => {
    const router = express.Router();
    const cartController = new CartController();

    router.post('/add', authenticateUser, cartController.addToCart.bind(cartController));
    // router.get('/', authenticateUser, cartController.getCart);
    // router.put('/update', authenticateUser, cartController.updateCartItem);
    // router.delete('/remove/:productId', authenticateUser, cartController.removeFromCart);
    // router.delete('/clear', authenticateUser, cartController.clearCart);
    // router.post('/checkout', authenticateUser, cartController.checkout);

    app.use('/api/cart', router);
}

export { setCartRoutes };