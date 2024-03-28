import express, {NextFunction, Request, Response} from "express";
import cors from "cors";
import "dotenv/config"
import mongoose from "mongoose";
import MyUserRoute from "./routes/MyUserRoute"
import { v2 as cloudinary } from "cloudinary";
import myRestaurantRoute from "./routes/MyRestaurantRoute"
import restaurantRoute from "./routes/RestaurantRoute"
import OrderRoute from "./routes/OrderRoute"

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=>console.log("Connected to database"))

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express()
app.use(cors())

app.use("/api/order/checkout/webhook", express.raw({type: "*/*"}))

app.use(express.json())

app.get("/health", async (req: Request, res: Response, next:NextFunction) => {
    res.send({message: "health is OK"});
})

app.use("/api/my/user/", MyUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute)
app.use("/api/restaurant", restaurantRoute)
app.use("/api/order", OrderRoute)

app.listen(7000, ()=>{
    console.log("Server started on localhost:7000")
})

