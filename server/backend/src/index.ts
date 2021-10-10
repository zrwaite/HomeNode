import env from 'dotenv';
import mongoose from 'mongoose';
import app from './server';

// Configs
env.config();
const port = process.env.PORT || 2000;

// Connect to MongoDB
mongoose.connect(
    `${process.env.MONGO_URL}`,
).catch((err: any) =>{
    console.error(err.stack)
    process.exit(1)
}).then(() => {
    // if connection is successful, log it and start the server
    console.log('Database connected');
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    });
});

/* 
import express from 'express';
const app = express();

const add = (a: number, b?: number) => {
    return a+b!;
}

app.get('/', (req: any) => {
    (req as any).name = 'bob';
    console.log(req.name);
    add(1);
});

app.listen(3001, () => {
    console.log("started");
})
console.log("hello world");
*/