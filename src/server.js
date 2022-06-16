import MongoDBContainer from './lib/MongoDBContainer.js';
import FirebaseContainer from './lib/FirebaseContainer.js';
import express from 'express';

const app = express();

const productsRouter = express.Router();
const cartRouter = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('../public'));

const p = new MongoDBContainer();

productsRouter.get('/:id?', async (req, res) => {
    const { id } = req.params; 
    const products = await p.getAll();

    if(products.length > 0) {
        const data = id 
            ? await p.getById(id)
            : products; 

        res.json(data || { message: 'Product not found' });
    } else {
        res.json({ message: 'Products not found' });
    }
});

productsRouter.post('/', async (req, res) => {
    const { admin } = req.body;

    const body = { ...req.body };
    delete body.admin;

    if(admin) {
        const id = await p.save(body);
        const message = id ? `Product saved with id ${id}` : 'Error saving product';
        
        res.json({ message });
    } else {
        res.status(401).json({ message: 'You are not authorized' });
    }
});

productsRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { admin } = req.body;

    const body = { ...req.body };
    delete body.admin;

    if(admin) {

        const updProduct = await p.updateById(id, body);

        res.json({ message: updProduct !== -1 
            ? 'Product updated' 
            : 'Product not found' 
        });
    } else {
        res.status(401).json({ message: 'You are not authorized' });
    }
});

productsRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { admin } = req.body;

    if(admin) {   
        const delProduct = await p.deleteById(id);

        res.json({ message: delProduct 
            ? 'Product deleted' 
            : 'Product not found' 
        });
    } else {
        res.status(401).json({ message: 'You are not authorized' });
    }
});

app.use('/api/products', productsRouter);

const c = new FirebaseContainer('cart');

cartRouter.post('/', async (req, res) => {
    const id = await c.save();
    const message = id ? `Cart created with id ${id}` : 'Error creating cart';

    res.json({ message });
});

cartRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const delCart = await c.deleteById(id);

    res.json({ message: delCart 
        ? 'Cart deleted' 
        : 'Cart not found' 
    });

});

cartRouter.get('/:id/products', async (req, res) => {
    const { id } = req.params;

    const cart = await c.getById(id);

    res.json(cart 
        ? cart.products || { message: 'Cart is empty' }
        : { message: 'Cart not found' }
    );
});

cartRouter.post('/:id/products', async (req, res) => {
    const { id } = req.params;
    const { idProd } = req.body;

    const updCart = await c.addProductById(id, idProd);

    res.json({ message: updCart || 'Cart not found' });
});

cartRouter.delete('/:id/products/:idProd', async (req, res) => {
    const { id, idProd } = req.params;

    const delCart = await c.removeProductById(Number(id), Number(idProd));

    res.json({ message: delCart || 'Product not found' });
});

app.use('/api/cart', cartRouter);

app.use(( req, res, next ) => res.status(404).json({ message: 'Page not found' }));

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
server.on('error', (err) => console.log(err));