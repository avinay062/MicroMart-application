import Product from '../models/Product.js';

class ProductService {
    async createProduct({data}){
        try {
            const { name, price, description, file } = data;
            if (!name || !price || !description) {
                const error = new Error('All fields are required.');
                error.status = 400;
                throw error;
            }
            if (!file) {
                const error = new Error('Product image is required.');
                error.status = 400;
                throw error;
            }
            const imageBase64 = file.buffer.toString('base64');
            const product = new Product({
                name,
                price: Number(price),
                description,
                image: imageBase64,
            });

            await product.save();
            return product;
        } catch (error) {
            console.error('Error in createProduct:', error);
            error.status = error.status || 500; // Default to 500 if no status is set
            throw error;
        }
    }

    async getAllProducts() {
        try {
            const products = await Product.find();
            return products;
        } catch (error) {
            error.status = 500;
            throw error;
        }
    }

    async getProductById(productId) {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                const error = new Error('Product not found');
                error.status = 404;
                throw error;
            }
            return product;
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            error.status = error.status || 500;
            throw error;
        }
    }

    async updateProduct(productId, data) {
        try {
            const { name, price, description, file } = data;
            if (!name && !price && !description && !file) {
                const error = new Error('At least one field is required to update the product.');
                error.status = 400;
                throw error;
            }
            if (price && price <= 0) {
                const error = new Error('Price must be a positive number.');
                error.status = 400;
                throw error;
            }
            const imageBase64 = file ? file.buffer.toString('base64') : undefined;
            // Update the product
            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                {
                    ...(name && { name }),
                    ...(price && { price: Number(price) }),
                    ...(description && { description }),
                    ...(imageBase64 && { image: imageBase64 }),
                },
                { new: true } // Return the updated document
            );

            if (!updatedProduct) {
                const error = new Error('Product not found');
                error.status = 404;
                throw error;
            }

            return updatedProduct;
        } catch (error) {
            console.error('Error updating product:', error);
            error.status = error.status || 500; // Default to 500 if no status is set
            throw error;
        }
    }

    async deleteProduct(productId) {
        try {
            const product = await Product.findByIdAndDelete(productId);
            if (!product) {
                const error = new Error('Product not found');
                error.status = 404;
                throw error;
            }
            return product;
        } catch (error) {
            console.error('Error deleting product:', error);
            error.status = error.status || 500;
            throw error;
        }
    }

    async getProductsByCategory() {
        try {
            const productsByCategory = await Product.aggregate([
                {
                    $group: {
                        _id: '$category',
                        averagePrice: { $avg: '$price' },
                        totalProducts: { $sum: 1 },
                        products: { $push: '$$ROOT' },
                    },
                },
                {
                    $sort: { averagePrice: -1 },
                },
            ]);
            return productsByCategory;
        } catch (error) {
            console.error('Error fetching products by category:', error);
            error.status = 500;
            throw error;
        }
    }

    async getProductsByPriceRange(minPrice, maxPrice) {
        try {
            const products = await Product.aggregate([
                {
                    $match: {
                        price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
                    },
                },
                {
                    $sort: { price: 1 },
                },
            ]);
            return products;
        } catch (error) {
            console.error('Error fetching products by price range:', error);
            error.status = 500;
            throw error;
        }
    }

    async countProductsByPriceRange(minPrice, maxPrice) {
        try {
            const count = await Product.aggregate([
                {
                    $match: {
                        price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
                    },
                },
                {
                    $count: 'totalProducts',
                },
            ]);
            return count;
        } catch (error) {
            console.error('Error counting products by price range:', error);
            error.status = 500;
            throw error;
        }
    }

    async getPaginatedProducts(page, limit) {
        try {
            const products = await Product.find()
                .skip((page - 1) * limit)
                .limit(Number(limit));
            return products;
        } catch (error) {
            console.error('Error fetching paginated products:', error);
            error.status = 500;
            throw error;
        }
    }

    async searchProducts(productName) {
        try {
            if (!productName) {
                const error = new Error('Product name is required for search.');
                error.status = 400;
                throw error;
            }

            const products = await Product.find({
                name: { $regex: productName, $options: 'i' }, // Case-insensitive search by product name
            });

            return products;
        } catch (error) {
            console.error('Error searching products by name:', error);
            error.status = 500;
            throw error;
        }
    }
}

export default new ProductService();