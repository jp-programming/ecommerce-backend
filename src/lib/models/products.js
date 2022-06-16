import mongoose from 'mongoose';

const productsCollection = 'products';

const productsSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now()},
    name: String,
    price: Number, 
    thumbnail: String,
    description: String,
    code: String,
    stock: Number,
});

export const Product = mongoose.model(productsCollection, productsSchema);
