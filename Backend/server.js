import express from "express";
import cors from "cors";
import { PORT } from "./config/serverConfig.js";
import connectDB from "./config/dBConfig.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

const app = express();

//Helps to make req.body available
app.use(express.json()); 

//Helps us to communicate with Api hosted on different domain
app.use(
  cors({
    origin: [
      "https://bazaar-235b.vercel.app/",
      "https://bazaar-admin-alpha.vercel.app/",
      "http://localhost:5173", // local frontend dev
      "http://localhost:5174", // local admin dev
    ],
    credentials: true,
  }),
);

//api endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("Api server is Working");
});

app.listen(PORT, () => {
  console.log(`Server is running on port no: ${PORT}`);
  connectDB();
});
