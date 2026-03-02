import Product from '../models/Product.js';
import { AppError } from 'shared-utils';

const handleUnexpected = (error, message) => {
    if (error instanceof AppError) {
        throw error;
    }
    throw AppError.internal(message, { reason: error.message });
};

class ProductService {
    async createProduct({ data }) {
        const { name, price, description, file } = data;
        if (!name || !price || !description) {
            throw AppError.badRequest('All fields are required.');
        }
        if (!file) {
            throw AppError.badRequest('Product image is required.');
        }

        try {
            const imageBase64 = file.buffer.toString('base64');
            const product = new Product({
                name,
                price: Number(price),
                description,
                image: imageBase64
            });

            await product.save();
            return product;
        } catch (error) {
            handleUnexpected(error, 'Failed to create product');
        }
    }

    async getAllProducts() {
        try {
            return await Product.find();
        } catch (error) {
            handleUnexpected(error, 'Failed to fetch products');
        }
    }

    async getProductById(productId) {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                throw AppError.notFound('Product not found', { productId });
            }
            return product;
        } catch (error) {
            handleUnexpected(error, 'Failed to fetch product');
        }
    }

    async updateProduct(productId, data) {
        const { name, price, description, file } = data;
        if (!name && !price && !description && !file) {
            throw AppError.badRequest('At least one field is required to update the product.');
        }
        if (price && Number(price) <= 0) {
            throw AppError.badRequest('Price must be a positive number.');
        }
        try {
            const imageBase64 = file ? file.buffer.toString('base64') : undefined;
            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                {
                    ...(name && { name }),
                    ...(price && { price: Number(price) }),
                    ...(description && { description }),
                    ...(imageBase64 && { image: imageBase64 })
                },
                { new: true }
            );

            if (!updatedProduct) {
                throw AppError.notFound('Product not found', { productId });
            }

            return updatedProduct;
        } catch (error) {
            handleUnexpected(error, 'Failed to update product');
        }
    }

    async deleteProduct(productId) {
        try {
            const product = await Product.findByIdAndDelete(productId);
            if (!product) {
                throw AppError.notFound('Product not found', { productId });
            }
            return product;
        } catch (error) {
            handleUnexpected(error, 'Failed to delete product');
        }
    }

    async getProductsByCategory() {
        try {
            return await Product.aggregate([
                {
                    $group: {
                        _id: '$category',
                        averagePrice: { $avg: '$price' },
                        totalProducts: { $sum: 1 },
                        products: { $push: '$$ROOT' }
                    }
                },
                {
                    $sort: { averagePrice: -1 }
                }
            ]);
        } catch (error) {
            handleUnexpected(error, 'Failed to fetch products by category');
        }
    }

    async getProductsByPriceRange(minPrice, maxPrice) {
        if (minPrice === undefined || maxPrice === undefined) {
            throw AppError.badRequest('Both minPrice and maxPrice are required.');
        }
        try {
            return await Product.aggregate([
                {
                    $match: {
                        price: { $gte: Number(minPrice), $lte: Number(maxPrice) }
                    }
                },
                {
                    $sort: { price: 1 }
                }
            ]);
        } catch (error) {
            handleUnexpected(error, 'Failed to fetch products by price range');
        }
    }

    async countProductsByPriceRange(minPrice, maxPrice) {
        if (minPrice === undefined || maxPrice === undefined) {
            throw AppError.badRequest('Both minPrice and maxPrice are required.');
        }
        try {
            return await Product.aggregate([
                {
                    $match: {
                        price: { $gte: Number(minPrice), $lte: Number(maxPrice) }
                    }
                },
                {
                    $count: 'totalProducts'
                }
            ]);
        } catch (error) {
            handleUnexpected(error, 'Failed to count products by price range');
        }
    }

    async getPaginatedProducts(page = 1, limit = 10) {
        const parsedPage = Number(page);
        const parsedLimit = Number(limit);
        if (parsedPage < 1 || parsedLimit < 1) {
            throw AppError.badRequest('Page and limit must be positive integers.');
        }
        try {
            return await Product.find()
                .skip((parsedPage - 1) * parsedLimit)
                .limit(parsedLimit);
        } catch (error) {
            handleUnexpected(error, 'Failed to fetch paginated products');
        }
    }

    async searchProducts(productName) {
        if (!productName) {
            throw AppError.badRequest('Product name is required for search.');
        }
        try {
            return await Product.find({
                name: { $regex: productName, $options: 'i' }
            });
        } catch (error) {
            handleUnexpected(error, 'Failed to search products');
        }
    }
}

export default new ProductService();