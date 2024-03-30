import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId, default: ()=> new mongoose.Types.ObjectId
    },
    auth0Id: {
        type: String, required: true, 
    },
    email: {
        type: String, required: true
    },
    name: {
        type: String,
    },
    addressLine1: {
        type: String,
    },
    city: {
        type: String,
    },
    country: {
        type: String,
    }

});

const User = mongoose.model("User", userSchema);
export default User;