import cartService from "../services/cartService.js";

class CartController {
    async addToCart(req, res) {
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        const cart = await cartService.addToCart(userId, productId, quantity);
        return res.status(200).json({ message: "Product added to cart successfully", cart });
    }

    async getCart(req, res) {
        const userId = req.user.id;
        const cart = await cartService.getCart(userId);
        return res.status(200).json({ message: "Cart retrieved successfully", cart });
    }

    async updateCartItem(req, res) {
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        const cart = await cartService.updateCartItem(userId, productId, quantity);
        return res.status(200).json({ message: "Cart item updated successfully", cart });
    }

    async removeFromCart(req, res) {
        const productId = req.params.productId;
        const userId = req.user.id;
        const cart = await cartService.removeFromCart(userId, productId);
        return res.status(200).json({ message: "Item removed from cart successfully", cart });
    }

    async clearCart(req, res) {
        const userId = req.user.id;
        const result = await cartService.clearCart(userId);
        return res.status(200).json(result);
    }

    async checkout(req, res) {
        const userId = req.user.id;
        const result = await cartService.checkout(userId);
        return res.status(201).json(result);
    }
}

export default CartController;