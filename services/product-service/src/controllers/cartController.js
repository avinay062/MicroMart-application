import Cart from "../models/cart.js";
import Product from "../models/product.js";
import axios from "axios";

class CartController {
    async addToCart(req, res) {
        try {
            const {productId, quantity = 1} = req.body;
            const userId = req.user.id;
            const product = await Product.findById(productId);
            if(!product) {
                return res.status(404).json({message: 'Product not found'});
            }
            let cart = await Cart.findOne({userId});
            if(!cart) {
                cart = new Cart({userId, items: [], totalAmount: 0});
            }

            const existingItem = cart.items.find(item => item.productId.toString() === productId);

            if(existingItem && quantity > 0){
                existingItem.quantity += quantity;
            } else {
                cart.items.push({productId, quantity});
            }

            cart.totalAmount = await this.calculateTotal(cart.items);
            await cart.save();
            return res.status(200).json({ message : "Product added to cart successfully", cart });
        } catch (error){
            console.error('Error adding to cart:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
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

    async getCart(req, res) {
        try {
            const userId = req.user.id;
            const cart  = await Cart.findOne({userId}).populate('items.productId');
            if(!cart) {
                return res.status(200).json({ message: 'Cart is empty', cart: {items: [], totalAmount: 0} });
            }
            return res.status(200).json({ message: 'Cart retrieved successfully', cart });
        } catch (error) {
            console.error('Error fetching cart:', error);
            return res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
        }
    }

    async updateCartItem(req, res) {
        try {
            const { productId, quantity } = req.body;
            const userId = req.user.id;

            if(quantity < 1) {
                return res.status(400).json({ message: 'Quantity must be at least 1' });
            }

            const cart = await Cart.findOne({ userId});
            if(!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            const item = cart.items.find(item => item.productId.toString() === productId);
            if(!item) {
                return res.status(404).json({ message: 'Product not found in cart' });
            }

            item.quantity = quantity;
            cart.totalAmount = await this.calculateTotal(cart.items);
            await cart.save();
            return res.status(200).json({ message: 'Cart item updated successfully', cart });
        } catch (error) {
            console.error('Error updating cart item:', error);
            return res.status(500).json({ message: 'Failed to update cart item', error: error.message });
        }
    }

    async removeFromCart(req, res) {
        try {
            const { productId } = req.body;
            const userId = req.user.id;
            const cart = await Cart.findOne({ userId });
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
            cart.totalAmount = await this.calculateTotal(cart.items);
            await cart.save();
            return res.status(200).json({ message: 'Item removed from cart successfully', cart });
        } catch (error) {
            console.error('Error removing from cart:', error);
            return res.status(500).json({ message: 'Failed to remove item from cart', error: error.message });
        }

    }

    async clearCart(req, res) {
        try {
            const userId = req.user.id;
            await Cart.findOneAndUpdate({ userId }, { items: [], totalAmount: 0 });
            return res.status(200).json({ message: 'Cart cleared successfully' });
        } catch (error) {
            console.error('Error clearing cart:', error);
            return res.status(500).json({ message: 'Failed to clear cart', error: error.message });
        }
    }

    async checkout(req, res) {
        try {
            const userId = req.user.id;
            const cart = await Cart.findOne({userId}).populate('items.productId');
            if(!cart || cart.items.length === 0) {
                return res.status(400).json({ message: 'Cart is empty' });
            }
            // Prepare order data
            const orderData = {
                userId,
                items : cart.items.map(item => ({
                    productId: item.productId._id,
                    productName: item.productId.name,
                    quantity: item.quantity,
                    price: item.productId.price
                })),
                totalAmount: cart.totalAmount
            };

            // send orderData to order-service
            const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:30012';
            const response = await axios.post(`${orderServiceUrl}/api/orders/create`, orderData);

            // clear cart after successful order creation
            await Cart.findOneAndUpdate({ userId }, { items: [], totalAmount: 0 });

            return res.status(201).json({ 
                message: 'Checkout successful', 
                order: response.data 
            });
        }
        catch (error) {
            console.error('Error during checkout:', error);
            return res.status(500).json(
                { 
                    message: 'Checkout failed', 
                    error: error.message 
                });
        }
    }


}

export default CartController;