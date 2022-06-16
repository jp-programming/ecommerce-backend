import { ad } from '../db/Firebase.js';
export default class FirebaseContainer {
    constructor(collName, products){
        this.db = ad.firestore();
        this.query = this.db.collection(collName);
        this.products = products;
    };

    async save() {
        return (await this.query.add({ timestamp: Date.now(), products: [] })).id;
    }

    async deleteById(id) {
        return await this.query.doc(id).delete(); 
    }

    async getById(id) {
        try {
            return (await this.query.doc(id).get()).data();
        }   catch(err) {
            return -1;
        }
    }

    async addProductById(id, idProd) {
        const cart = await this.getById(id);
        if(cart === -1) return;

        const isInCart = cart.products.find(obj => obj._id === idProd);
        if(isInCart) return 'Product already exists in cart';

        const product = await this.products.getById(idProd);
        if(product === null) return 'Product not found';
        
        const newObject = {
            ...product._doc,
            _id: idProd,
        };
        
        await this.query.doc(id).update({ products: ad.firestore.FieldValue.arrayUnion(newObject) });

        return 'Product added to cart';
    };

    async removeProductById(id, idProd){
        const cart = await this.getById(id);
        if(cart === -1) return 'Cart not found';

        const isInCart = cart.products.find(obj => obj._id === idProd);
        if(!isInCart) return;
        
        await this.query.doc(id).update({ products: ad.firestore.FieldValue.arrayRemove(isInCart) });
        
        return 'Product removed from cart';
    }
}