const fsPromises = require('fs/promises');

module.exports = class Container {
    constructor(filename){
        this.dir = './data';
        this.root = `${this.dir}/${filename}`;
    };

    async save(obj = {}){
        const arr = await this.getAll();

        if(!arr.length){
            try {
                await fsPromises.mkdir(this.dir);
                await fsPromises.writeFile(this.root, JSON.stringify(
                    [{...obj, timestamp: Date.now(), id: 1}], null, 2
                ));

                return 1;
            } catch (error) {
                console.log('La carpeta ya existe', error.code);
            }
        }

        const maxID = arr.reduce((max, obj) => Math.max(max, obj.id), 0);
        const newObj = {...obj, timestamp: Date.now(), id: maxID + 1};
        arr.push(newObj);

        try {
            await fsPromises.writeFile(this.root, JSON.stringify(arr, null, 2));
            return newObj.id;
        } catch (error) {
            console.log('No se pudo escribir el archivo', error.code);
        }
        
        return;
    };

    async getById(id){
        const data = await this.getAll();
        return data.find(obj => obj.id === id);
    };

    async getAll(root = this.root){
        try {
            const data = await fsPromises.readFile(root);
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    };

    async updateById(id, body) {
        const data = await this.getAll();

        const product = data.find(obj => obj.id === id);
        if(product === undefined) return -1;

        const updProduct = {
            ...product,
            ...body
        };

        const index = data.indexOf(product);
        data.splice(index, 1, updProduct);

        try {
            await fsPromises.writeFile(this.root, JSON.stringify(data, null, 2));
            return 1;
        }
        catch (error) {
            console.log('No se pudo escribir el archivo', error.code);
        }
    };

    async deleteById(id){
        const arr = await this.getAll();
        const index = arr.findIndex(obj => obj.id === id);

        if(index === -1){
            return;
        }

        arr.splice(index, 1);
        await fsPromises.writeFile(this.root, JSON.stringify(arr, null, 2));
        
        return 1;
    };  

    async addProductById(id, idProd) {
        const cart = await this.getAll(this.root);
        const index = cart.findIndex(obj => obj.id === id);

        if(index === -1) return;

        const isInCart = !cart[index].products 
            ? cart[index].products = []
            : cart[index].products.find(obj => obj.id === idProd);

        if(!Array.isArray(isInCart) && isInCart) return 'Product already exists in cart';

        const products = await this.getAll(this.dir+'/products.txt');

        const product = products.find(obj => obj.id === idProd);
        if(product === undefined) return 'Product not found';

        const newCartProduct = {
            ...cart[index],
            products: [...cart[index].products, product]
        };

        cart.splice(index, 1, newCartProduct);

        await fsPromises.writeFile(this.root, JSON.stringify(cart, null, 2));
        return 'Product added to cart';
    };

    async removeProductById(id, idProd){
        const cart = await this.getAll(this.root);
        const index = cart.findIndex(obj => obj.id === id);

        if(index === -1) return;

        const products = cart[index].products;
        const indexProd = products.findIndex(obj => obj.id === idProd);

        if(indexProd === -1) return;

        products.splice(indexProd, 1);

        const newCartProduct = {
            ...cart[index],
            products: [...products]
        };

        cart.splice(index, 1, newCartProduct);

        await fsPromises.writeFile(this.root, JSON.stringify(cart, null, 2));
        return 'Product removed from cart';
    }
};