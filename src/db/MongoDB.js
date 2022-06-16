import mongoose from "mongoose";

const URL = `mongodb+srv://root:root@cluster0.pxkve3d.mongodb.net/ecommerce?retryWrites=true&w=majority`;

export const mongo = { 
    connection: () => {
        mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log('Connected to MongoDB');
        }).catch(err => {
            console.log('Error connecting to MongoDB:', err.message);
        })
    }
};
