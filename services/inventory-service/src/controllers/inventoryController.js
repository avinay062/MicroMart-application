class InventoryController {
    constructor(InventoryModel) {
        this.InventoryModel = InventoryModel;
    }

    async updateStock(req, res) {
        const { productId, quantity } = req.body;
        try {
            const inventory = await this.InventoryModel.findOneAndUpdate(
                { productId: productId },
                { $inc: { stock: -quantity } },
                { new: true }
            );
            if (!inventory) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json(inventory);
        } catch (error) {
            res.status(500).json({ message: 'Error updating stock', error });
        }
    }

    async getStock(req, res) {
        const { productId } = req.params;
        try {
            const inventory = await this.InventoryModel.findOne({ productId: productId });
            if (!inventory) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json(inventory);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching stock', error });
        }
    }
}

module.exports = InventoryController;