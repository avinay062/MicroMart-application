import express from 'express';
import CartController from '../controllers/cartController.js';
import { authenticateUser } from 'shared-utils';

const setCartRoutes = (app) => {
    const router = express.Router();
    const cartController = new CartController(); // Create a new instance of the class

    router.post('/add', authenticateUser, cartController.addToCart.bind(cartController));
    router.get('/', authenticateUser, cartController.getCart.bind(cartController));
    router.put('/update', authenticateUser, cartController.updateCartItem.bind(cartController));
    router.delete('/remove/:productId', authenticateUser, cartController.removeFromCart.bind(cartController));
    router.delete('/clear', authenticateUser, cartController.clearCart.bind(cartController));
    router.post('/checkout', authenticateUser, cartController.checkout.bind(cartController));

    app.use('/api/cart', router);
}

export { setCartRoutes };