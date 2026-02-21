import productService from "../services/productService.js";

class ProductController {
    async createProduct(req, res) {
        try {
            const { name, price, description } = req.body;
            const file = req.file;
            const product = await productService.createProduct({ 
                data: { name, price, description, file } 
            });
            res.status(201).json({
                message: 'Product created successfully',
                product: product.product,
            });
        } catch (error) {
            console.error('Error creating product:', error);
            if(error.status){
                return res.status(error.status).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getAllProducts(req, res) {
        try {
            const products = await productService.getAllProducts();
            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ message: 'Failed to fetch Products', error: error.message });
        }
    }

    async getProduct(req, res) {
        try {
            const productId = req.params.id;
            const product = await productService.getProductById(productId);
            res.status(200).json(product);
        } catch (error) {
            console.error('Error fetching product:', error);
            if (error.status) {
                return res.status(error.status).json({ message: error.message });
            }
            res.status(500).json({ message: 'Failed to fetch product', error: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const productId = req.params.id;
            const { name, price, description } = req.body;
            const file = req.file;
            const updatedProduct = await productService.updateProduct(productId, {
                name,
                price,
                description,
                file,
            });
            res.status(200).json({
                message: 'Product updated successfully',
                product: updatedProduct,
            });
        } catch (error) {
            console.error('Error updating product:', error);
            if (error.status) {
                return res.status(error.status).json({ message: error.message });
            }
            res.status(500).json({ message: 'Failed to update product', error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const productId = req.params.id;

            // Delegate the logic to the service layer
            const product = await productService.deleteProduct(productId);

            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error('Error deleting product:', error);

            // Handle errors and send appropriate status code
            if (error.status) {
                return res.status(error.status).json({ message: error.message });
            }

            res.status(500).json({ message: 'Failed to delete product', error: error.message });
        }
    }

    async getProductsByCategory(req, res) {
        try {
            // Delegate the logic to the service layer
            const productsByCategory = await productService.getProductsByCategory();

            res.status(200).json(productsByCategory);
        } catch (error) {
            console.error('Error fetching products by category:', error);

            // Handle errors and send appropriate status code
            res.status(500).json({ message: 'Failed to fetch products by category', error: error.message });
        }
    }

    async getProductsByPriceRange(req, res) {
        try {
            const { minPrice, maxPrice } = req.query;

            // Delegate the logic to the service layer
            const products = await productService.getProductsByPriceRange(minPrice, maxPrice);

            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products by price range:', error);

            // Handle errors and send appropriate status code
            res.status(500).json({ message: 'Failed to fetch products by price range', error: error.message });
        }
    }

    async countProductsByPriceRange(req, res) {
        try {
            const { minPrice, maxPrice } = req.query;

            // Delegate the logic to the service layer
            const count = await productService.countProductsByPriceRange(minPrice, maxPrice);

            res.status(200).json(count);
        } catch (error) {
            console.error('Error counting products by price range:', error);

            // Handle errors and send appropriate status code
            res.status(500).json({ message: 'Failed to count products by price range', error: error.message });
        }
    }

    async getPaginatedProducts(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;

            // Delegate the logic to the service layer
            const products = await productService.getPaginatedProducts(Number(page), Number(limit));

            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching paginated products:', error);

            // Handle errors and send appropriate status code
            res.status(500).json({ message: 'Failed to fetch paginated products', error: error.message });
        }
    }

    async searchProducts(req, res) {
        try {
            const { productName } = req.body;
            const products = await productService.searchProducts(productName);

            res.status(200).json({
                message: 'Products retrieved successfully',
                products,
            });
        } catch (error) {
            console.error('Error searching products:', error);
            res.status(error.status || 500).json({ message: 'Failed to search products', error: error.message });
        }
    }
}

export default ProductController;