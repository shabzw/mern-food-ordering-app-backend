import {Request, Response} from "express";
import User from "../models/user"

const getCurrentUser = async(req: Request, res: Response) => {
    try {
        const currentUser = await User.findOne({_id: req.userId});
    if(!currentUser){
        return res.status(404).json({message: "User not found"})
    }
    res.send(currentUser)

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Unable to fetch data"});
    }
    

}

const createCurrentUser = async(req: Request, res: Response) => {
    // 1. check if the user exists
    // 2. create the user if it doesn't exist
    // 3. return the user to the calling client
    try{
        const {auth0Id, email} = req.body;
        console.log(auth0Id+"This is authID")
        const existingUser = await User.findOne({email})
        console.log(existingUser)
        
        if(existingUser){

            return res.status(200).send("Look")
        }
        const newUser = new User(req.body)
        await newUser.save();

        res.status(201).json(newUser.toObject())
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Error creating the user"})
    }
};

const updateCurrentUser = async(req:Request, res:Response) => {
    try {
        const {name, addressLine1, country, city} = req.body
        const user = await User.findById(req.userId);

        if(!user){
            return res.status(500).json({message: "User not found"})
        }

        user.name=name;
        user.addressLine1=addressLine1;
        user.city=city;
        user.country=country;

        await user.save();

        res.send(user)

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error Updating User"});
        
    }
}

export default {
    createCurrentUser, updateCurrentUser, getCurrentUser,
}
