import { Request, Response } from "express"
import Restaurant from "../models/restaurant";
import cloudinary from "cloudinary"
import mongoose from "mongoose";
import Order from "../models/order";

const getMyRestaurant = async(req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({user: req.userId});
    if(!restaurant){
        return res.status(404).json({message: "Restaurant not found"})
    }
    res.json(restaurant)

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error fetching Restaurant"});
    }

}

const createMyRestaurant = async (req: Request, res: Response) => {
    try {
        console.log((req.userId))
        const existingRestaurant = await Restaurant.findOne({user: req.userId})

        if(existingRestaurant){
            return res.status(409).json({message: "User restaurant already exists"})
        }

        // const image = req.file as Express.Multer.File;
        // const base64Image = Buffer.from(image.buffer).toString("base64");
        // const dataURI = `data:${image.mimetype};base64,${base64Image}`

        // const uploadResponse = await cloudinary.v2.uploader.upload(dataURI)
        const imageUrl = await UploadImage(req.file as Express.Multer.File)

        const restaurant = new Restaurant(req.body)
        restaurant.imageURL = imageUrl;
        restaurant.user = new mongoose.Types.ObjectId(req.userId)
        restaurant.lastUpdated = new Date()
        await restaurant.save()

        res.status(201).send(restaurant);
    } catch (error) {
        console.log(error);
        res.status(500).json("Something went wrong")
    }
};


const updateMyRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({
            user: req.userId,
        });
        if(!restaurant){
            return res.status(404).json({message: "Restaurant not found"});
        }

        restaurant.restaurantName = req.body.restaurantName
        restaurant.city = req.body.city
        restaurant.country = req.body.country
        restaurant.deliveryPrice = req.body.deliveryPrice
        restaurant.cuisines = req.body.cuisines
        // restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime
        restaurant.menuItems = req.body.menuItems
        restaurant.lastUpdated = new Date();
        restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;


        if(req.file){
            const imageUrl = await UploadImage(req.file as Express.Multer.File)
            restaurant.imageURL = imageUrl
        }

        await restaurant.save();
        res.status(200).send(restaurant)

    } catch (error) {
        console.log("error", error);
        res.status(500).json({message: "Something went wrong"});
    }
}

const getMyRestaurantOrders = async(req:Request, res:Response) =>{
    try {
        const restaurant = await Restaurant.findOne({user: req.userId});
        if(!restaurant){
            return res.status(404).json({message: "Restaurant not found"})
        }
        const orders = await Order.find({restaurant: restaurant.id}).populate("restaurant").populate("user")
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"})
    }
    
}

const updateOrderStatus = async(req:Request, res: Response) => {
    try {
        // console.log(req.body)
        const {orderId} = req.params;
        const {status} = req.body;
        console.log(status)

        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({message: "order not found"})
        }

        const restaurant = await Restaurant.findById(order.restaurant)

        if(restaurant?.user?._id.toString()!==req.userId){
            return res.status(401).send();
        }

        order.status = status;
        await order.save();

        res.status(200).json(order);

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Unable to update order status"})
    }
}

const UploadImage = async(file: Express.Multer.File) => {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`

    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    return uploadResponse.url
}

export default {
    getMyRestaurant, createMyRestaurant, updateMyRestaurant, getMyRestaurantOrders, updateOrderStatus
}