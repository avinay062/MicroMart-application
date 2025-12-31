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

            if(existingItem){
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
}

export default CartController;