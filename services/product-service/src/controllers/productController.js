import productService from "../services/productService.js";

class ProductController {
    async createProduct(req, res) {
        const { name, price, description } = req.body;
        const file = req.file;
        const product = await productService.createProduct({
            data: { name, price, description, file }
        });
        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    }

    async getAllProducts(req, res) {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    }

    async getProduct(req, res) {
        const productId = req.params.id;
        const product = await productService.getProductById(productId);
        res.status(200).json(product);
    }

    async updateProduct(req, res) {
        const productId = req.params.id;
        const { name, price, description } = req.body;
        const file = req.file;
        const updatedProduct = await productService.updateProduct(productId, {
            name,
            price,
            description,
            file
        });
        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    }

    async deleteProduct(req, res) {
        const productId = req.params.id;
        await productService.deleteProduct(productId);
        res.status(200).json({ message: 'Product deleted successfully' });
    }

    async getProductsByCategory(req, res) {
        const productsByCategory = await productService.getProductsByCategory();
        res.status(200).json(productsByCategory);
    }

    async getProductsByPriceRange(req, res) {
        const { minPrice, maxPrice } = req.query;
        const products = await productService.getProductsByPriceRange(minPrice, maxPrice);
        res.status(200).json(products);
    }

    async countProductsByPriceRange(req, res) {
        const { minPrice, maxPrice } = req.query;
        const count = await productService.countProductsByPriceRange(minPrice, maxPrice);
        res.status(200).json(count);
    }

    async getPaginatedProducts(req, res) {
        const { page = 1, limit = 10 } = req.query;
        const products = await productService.getPaginatedProducts(Number(page), Number(limit));
        res.status(200).json(products);
    }

    async searchProducts(req, res) {
        const { productName } = req.body;
        const products = await productService.searchProducts(productName);
        res.status(200).json({
            message: 'Products retrieved successfully',
            products
        });
    }
}

export default ProductController;