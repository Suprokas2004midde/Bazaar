import express from 'express'
import cors from 'cors'
import { PORT } from './config/serverConfig.js';
import connectDB from './config/dBConfig.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js'
import orderRouter from './routes/orderRoutes.js';


const app = express();

app.use(express.json()) //Helps to make req.body available 
app.use(cors()) //Helps us to communicate with Api hosted on different domain

//api endpoints
app.use('/api/user', userRouter); 
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/',(req,res)=>{
    res.send("Api server is Working");
})

app.listen(PORT,()=>{
    console.log(`Server is running on port no: ${PORT}`);
    connectDB();
})