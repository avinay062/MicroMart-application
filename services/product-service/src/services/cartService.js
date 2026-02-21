import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import axios from "axios";

class CartService {
    async addToCart(userId, productId, quantity = 1) {
        const product = await Product.findById(productId);
        if (!product) {
            const error = new Error('Product not found');
            error.status = 404;
            throw error;
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [], totalAmount: 0 });
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (existingItem && quantity > 0) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        cart.totalAmount = await this.calculateTotal(cart.items);
        await cart.save();
        return cart;
    }

    async calculateTotal(items) {
        let total = 0;
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (product) {
                total += product.price * item.quantity;
            }
        }
        return total;
    }

    async getCart(userId) {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return { items: [], totalAmount: 0 };
        }
        return cart;
    }

    async updateCartItem(userId, productId, quantity) {
        if (quantity < 1) {
            const error = new Error('Quantity must be at least 1');
            error.status = 400;
            throw error;
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            const error = new Error('Cart not found');
            error.status = 404;
            throw error;
        }

        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) {
            const error = new Error('Product not found in cart');
            error.status = 404;
            throw error;
        }

        item.quantity = quantity;
        cart.totalAmount = await this.calculateTotal(cart.items);
        await cart.save();
        return cart;
    }

    async removeFromCart(userId, productId) {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            const error = new Error('Cart not found');
            error.status = 404;
            throw error;
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        cart.totalAmount = await this.calculateTotal(cart.items);
        await cart.save();
        return cart;
    }

    async clearCart(userId) {
        await Cart.findOneAndUpdate({ userId }, { items: [], totalAmount: 0 });
        return { message: 'Cart cleared successfully' };
    }

    async checkout(userId) {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            const error = new Error('Cart is empty');
            error.status = 400;
            throw error;
        }

        // Prepare order data
        const orderData = {
            userId,
            items: cart.items.map(item => ({
                productId: item.productId._id,
                productName: item.productId.name,
                quantity: item.quantity,
                price: item.productId.price,
            })),
            totalAmount: cart.totalAmount,
        };

        // Send orderData to order-service
        const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:30012';
        const response = await axios.post(`${orderServiceUrl}/api/orders/create`, orderData);

        // Clear cart after successful order creation
        await Cart.findOneAndUpdate({ userId }, { items: [], totalAmount: 0 });

        return { message: 'Checkout successful', order: response.data };
    }
}

export default CartService;
