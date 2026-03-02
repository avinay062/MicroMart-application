const Inventory = require('../models/inventory');
const { AppError } = require('shared-utils');

class InventoryController {
    constructor(InventoryModel = Inventory) {
        this.InventoryModel = InventoryModel;
    }

    async updateStock(req, res) {
        const { productId, quantity } = req.body;
        if (!productId || typeof quantity !== 'number') {
            throw AppError.badRequest('productId and numeric quantity are required');
        }

        const inventory = await this.InventoryModel.findOneAndUpdate(
            { productId },
            { $inc: { stockLevel: -quantity } },
            { new: true }
        );

        if (!inventory) {
            throw AppError.notFound('Product not found in inventory', { productId });
        }

        return res.status(200).json({ message: 'Stock updated successfully', data: inventory });
    }

    async getStock(req, res) {
        const { productId } = req.params;
        const inventory = await this.InventoryModel.findOne({ productId });
        if (!inventory) {
            throw AppError.notFound('Product not found in inventory', { productId });
        }
        return res.status(200).json({ message: 'Stock retrieved successfully', data: inventory });
    }
}

module.exports = InventoryController;