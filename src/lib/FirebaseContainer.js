import { ad } from '../db/Firebase.js';

export default class FirebaseContainer {
    constructor(collName){
        this.db = ad;
        this.query = this.db.collection(collName);
    };

    async save() {
        return (await this.query.add({ timestamp: Date.now(), products: [] })).id;
    }

    async deleteById(id) {
        return await this.query.doc(id).delete(); 
    }

    async getById(id) {
        return await this.query.doc(id).get();
    }

    async addProductById(id, idProd) {
        // const cart = await this.getAll(this.root);
        // const index = cart.findIndex(obj => obj.id === id);

        // if(index === -1) return;

        // const isInCart = !cart[index].products 
        //     ? cart[index].products = []
        //     : cart[index].products.find(obj => obj.id === idProd);

        // if(!Array.isArray(isInCart) && isInCart) return 'Product already exists in cart';

        // const products = await this.getAll(this.dir+'/products.txt');

        // const product = products.find(obj => obj.id === idProd);
        // if(product === undefined) return 'Product not found';

        // const newCartProduct = {
        //     ...cart[index],
        //     products: [...cart[index].products, product]
        // };

        // cart.splice(index, 1, newCartProduct);

        // await fsPromises.writeFile(this.root, JSON.stringify(cart, null, 2));
        // return 'Product added to cart';
    };

    async removeProductById(id, idProd){
        // const cart = await this.getAll(this.root);
        // const index = cart.findIndex(obj => obj.id === id);

        // if(index === -1) return;

        // const products = cart[index].products;
        // const indexProd = products.findIndex(obj => obj.id === idProd);

        // if(indexProd === -1) return;

        // products.splice(indexProd, 1);

        // const newCartProduct = {
        //     ...cart[index],
        //     products: [...products]
        // };

        // cart.splice(index, 1, newCartProduct);

        // await fsPromises.writeFile(this.root, JSON.stringify(cart, null, 2));
        // return 'Product removed from cart';
    }
}