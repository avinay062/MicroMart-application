import cartService from "../services/cartService.js";

class CartController {
    async addToCart(req, res) {
        try {
            const { productId, quantity } = req.body;
            const userId = req.user.id;

            // Delegate to service layer
            const cart = await cartService.addToCart(userId, productId, quantity);

            return res.status(200).json({ message: "Product added to cart successfully", cart });
        } catch (error) {
            console.error("Error adding to cart:", error);
            return res.status(error.status || 500).json({ message: error.message });
        }
    }

    async getCart(req, res) {
        try {
            const userId = req.user.id;

            // Delegate to service layer
            const cart = await cartService.getCart(userId);

            return res.status(200).json({ message: "Cart retrieved successfully", cart });
        } catch (error) {
            console.error("Error fetching cart:", error);
            return res.status(error.status || 500).json({ message: error.message });
        }
    }

    async updateCartItem(req, res) {
        try {
            const { productId, quantity } = req.body;
            const userId = req.user.id;

            // Delegate to service layer
            const cart = await cartService.updateCartItem(userId, productId, quantity);

            return res.status(200).json({ message: "Cart item updated successfully", cart });
        } catch (error) {
            console.error("Error updating cart item:", error);
            return res.status(error.status || 500).json({ message: error.message });
        }
    }

    async removeFromCart(req, res) {
        try {
            const { productId } = req.body;
            const userId = req.user.id;

            // Delegate to service layer
            const cart = await cartService.removeFromCart(userId, productId);

            return res.status(200).json({ message: "Item removed from cart successfully", cart });
        } catch (error) {
            console.error("Error removing from cart:", error);
            return res.status(error.status || 500).json({ message: error.message });
        }
    }

    async clearCart(req, res) {
        try {
            const userId = req.user.id;

            // Delegate to service layer
            const result = await cartService.clearCart(userId);

            return res.status(200).json(result);
        } catch (error) {
            console.error("Error clearing cart:", error);
            return res.status(error.status || 500).json({ message: error.message });
        }
    }

    async checkout(req, res) {
        try {
            const userId = req.user.id;

            // Delegate to service layer
            const result = await cartService.checkout(userId);

            return res.status(201).json(result);
        } catch (error) {
            console.error("Error during checkout:", error);
            return res.status(error.status || 500).json({ message: error.message });
        }
    }
}

export default CartController;