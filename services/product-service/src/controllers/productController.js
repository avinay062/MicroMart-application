import Product from '../models/product.js';

class ProductController {
    async createProduct(req, res) {
        try {
            const { name, price, description } = req.body;
            if (!name || !price || !description) {
                return res.status(400).json({ message: 'All fields are required.' });
            }
            if (!req.file) {
                return res.status(400).json({ message: 'Product image is required.' });
            }

            // const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            // const product = new Product({
            //     name,
            //     price: Number(price),
            //     description,
            //     image: imageUrl
            // });
            
            // Convert file buffer to Base64 string
            const imageBase64 = req.file.buffer.toString('base64');

            // Create and save the product
            const product = new Product({
                name,
                price: Number(price),
                description,
                image: imageBase64, // Store Base64 string in the database
            });
            
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
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ message: 'Failed to fetch Products', error: error.message });
        }
    }

    async getProduct(req, res) {
        try {
            const productId = req.params.id;
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json(product);
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ message: 'Failed to fetch product', error: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const productId = req.params.id;
            const { name, price, description } = req.body;

            if (!name && !price && !description && !req.file) {
                return res.status(400).json({ message: 'At least one field is required to update the product.' });
            }

            if (price && price <= 0) {
                return res.status(400).json({ message: 'Price must be a positive number.' });
            }

            const imageBase64 = req.file ? req.file.buffer.toString('base64') : undefined;

            // Update the product in a single database operation
            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                {
                    ...(name && { name }),
                    ...(price && { price: Number(price) }),
                    ...(description && { description }),
                    ...(imageBase64 && { image: imageBase64 }),
                },
                { new: true } 
            );

            // Check if the product exists
            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ message: 'Failed to update product', error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const productId = req.params.id;
            const product = await Product.findByIdAndDelete(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ message: 'Failed to delete product', error: error.message });
        }
    }
}

export default ProductController;