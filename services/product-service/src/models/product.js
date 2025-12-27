import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    image: {
        type: String,
        required: true,
    },
});

productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;