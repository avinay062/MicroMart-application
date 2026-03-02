import express from 'express';
import CartController from '../controllers/cartController.js';
import { authenticateUser, catchAsync } from 'shared-utils';

const setCartRoutes = (app) => {
    const router = express.Router();
    const cartController = new CartController();
    const wrap = (handler) => catchAsync(handler.bind(cartController));

    router.post('/add', authenticateUser, wrap(cartController.addToCart));
    router.get('/', authenticateUser, wrap(cartController.getCart));
    router.put('/update', authenticateUser, wrap(cartController.updateCartItem));
    router.delete('/remove/:productId', authenticateUser, wrap(cartController.removeFromCart));
    router.delete('/clear', authenticateUser, wrap(cartController.clearCart));
    router.post('/checkout', authenticateUser, wrap(cartController.checkout));

    app.use('/api/cart', router);
}

export { setCartRoutes };