const Product = require('../models/product');

class ProductController {
    async createProduct(req, res) {
        try {
            const { name, price, description } = req.body;
            if (!name || !price || !description) {
                return res.status(400).json({ message: 'All fields are required.' });
            }
            const product = new Product({ name, price, description });
            await product.save();

            res.status(201).json({
                message: 'Product created successfully',
                product,
            });
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getAllProducts(req, res) {
        try {
             const products = await Product.find();
             res.status(200).json(products);
        } catch(error){
            console.error('Error fetching products:', error);
            res.status(500).json({ message: 'Failed to fetch Products', error: error.message });
        }
    }

    async getProduct(req, res) {
        // Logic for retrieving a product by ID
    }

    async updateProduct(req, res) {
        // Logic for updating a product by ID
    }

    async deleteProduct(req, res) {
        // Logic for deleting a product by ID
    }
}

module.exports = ProductController;