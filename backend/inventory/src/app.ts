import express from "express";
import corsConfig from "./config/cors.config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler, notFoundError } from "./utils/error.handler";
import { connectDB } from "./models";
import inventoryRoutes from "./routes/inventory/index.routes";
import customerRoutes from "./routes/customer/customer.routes";
import orderRoutes from "./routes/orders/orders.routes";
import authenticate from "./middlewares/authenticate";


const app = express();

app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

connectDB();

//routes
app.use("/inventory",authenticate,inventoryRoutes);
app.use("/customer",authenticate,customerRoutes);
app.use("/orders",authenticate,orderRoutes);

app.use(notFoundError);
app.use(errorHandler);


export default app;