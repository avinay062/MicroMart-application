import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import axios from "axios";
import { AppError } from 'shared-utils';

class CartService {
    async addToCart(userId, productId, quantity = 1) {
        if (quantity < 1) {
            throw AppError.badRequest('Quantity must be at least 1');
        }
        const product = await Product.findById(productId);
        if (!product) {
            throw AppError.notFound('Product not found', { productId });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [], totalAmount: 0 });
        }

        const existingItem = cart.items.find((item) => item.productId.toString() === productId);

        if (existingItem) {
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
            throw AppError.badRequest('Quantity must be at least 1');
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            throw AppError.notFound('Cart not found', { userId });
        }

        const item = cart.items.find((entry) => entry.productId.toString() === productId);
        if (!item) {
            throw AppError.notFound('Product not found in cart', { productId });
        }

        item.quantity = quantity;
        cart.totalAmount = await this.calculateTotal(cart.items);
        await cart.save();
        return cart;
    }

    async removeFromCart(userId, productId) {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            throw AppError.notFound('Cart not found', { userId });
        }

        const originalLength = cart.items.length;
        cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
        if (cart.items.length === originalLength) {
            throw AppError.notFound('Product not found in cart', { productId });
        }

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
            throw AppError.badRequest('Cart is empty');
        }

        const orderData = {
            userId,
            items: cart.items.map((item) => ({
                productId: item.productId._id,
                productName: item.productId.name,
                quantity: item.quantity,
                price: item.productId.price
            })),
            totalAmount: cart.totalAmount
        };

        const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:3001';
        try {
            const response = await axios.post(`${orderServiceUrl}/orders`, orderData);
            await Cart.findOneAndUpdate({ userId }, { items: [], totalAmount: 0 });
            return { message: 'Checkout successful', order: response.data };
        } catch (error) {
            throw AppError.internal('Order service unavailable', { reason: error.message }, 'ERR_ORDER_SERVICE_UNAVAILABLE');
        }
    }
}

export default new CartService();
