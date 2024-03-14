import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
const handleValidationErrors = async (req: Request, res: Response, next: NextFunction)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next();
}

export const validateMyUserRequest = [
    body("name").isString().notEmpty().withMessage("Name must be a String"),
    body("addressLine1").isString().notEmpty().withMessage("Address Line must be a String"),
    body("city").isString().notEmpty().withMessage("City must be a String"),
    body("country").isString().notEmpty().withMessage("Country must be a String"),
    handleValidationErrors
];

export const validateMyRestaurantRequest = [
    body("restaurantName").notEmpty().withMessage("Restaurant name is required"),
    body("city").notEmpty().withMessage("City name is required"),
    body("country").notEmpty().withMessage("Country name is required"),
    body("deliveryPrice").isFloat({min: 0}).withMessage("Delivery price must be a positive number"),
    body("estimatedDeliveryTime").isInt({min: 0}).withMessage("Estimated delivery time must be positive integer"),
    body("cuisines").isArray().withMessage("Cuisines must be an array").not().isEmpty().withMessage("Cusines array cannot be empty"),
    body("menuItems").isArray().withMessage("Menu Items must be an array"),
    body("menuItems.*.name").notEmpty().withMessage("Menu item name is required"),
    body("menuItems.*.price").isFloat({min: 0}).withMessage("Menu item price is required and must be a positive integer"),
    handleValidationErrors
]