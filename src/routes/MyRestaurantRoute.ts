import express from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/Validation";


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    }
})

// api/my/restaurant
router.post("/",
 upload.single("imageFile"), 
 jwtCheck, 
 jwtParse, 
 validateMyRestaurantRequest, 
 MyRestaurantController.createMyRestaurant);

router.patch("/order/:orderId/status", jwtCheck, jwtParse, MyRestaurantController.updateOrderStatus)
 
router.get("/order", jwtCheck, jwtParse, MyRestaurantController.getMyRestaurantOrders)

router.get("/",
//  upload.single("imageFile"), 
 jwtCheck, 
 jwtParse, 
//  validateMyRestaurantRequest, 
 MyRestaurantController.getMyRestaurant);

 router.put("/",
 upload.single("imageFile"), 
 jwtCheck, 
 jwtParse, 
 validateMyRestaurantRequest, 
 MyRestaurantController.updateMyRestaurant)

export default router;