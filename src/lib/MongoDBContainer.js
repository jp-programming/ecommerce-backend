import { mongo } from '../db/MongoDB.js';
import { Product } from './models/products.js';

export default class MongoDBContainer {
    constructor(){
        this.db = mongo;
    };

    async save(obj){
        this.db.connection();
        
        try {
            const { _id } = await Product.create(obj);

            return _id;
        } catch (error) {
            console.log(error);
        }
    };

    async getById(id){
        this.db.connection();

        try {
            const data = await Product.findById(id, { __v: 0 });

            return data;
        } catch (error) {
            console.log(error);
        }
    };

    async getAll(){
        this.db.connection();

        try {
            const data = await Product.find();
        
            return data;
        } catch (error) {
            console.log(error);
        }

        return;
    };

    async updateById(id, body) {
        this.db.connection();

        try {
            const data = await Product.findByIdAndUpdate(id, body);

            return data;
        } catch (error) {
            console.log(error);
        }

        return -1;
    };

    async deleteById(id){
        this.db.connection();

        try {
            const data = await Product.findByIdAndDelete(id);

            return data;
        } catch (error) {
            console.log(error);
        }

        return;
    };  
};