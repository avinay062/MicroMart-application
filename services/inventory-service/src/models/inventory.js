const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    stockLevel: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;