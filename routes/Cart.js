const express = require("express");
const routes = express();
const cartValidator = require("../middleware/cartValidation");
const CartController = require("../controller/CartController");
const AuthValidator = require("../middleware/auth");

routes.get("/getCartById",AuthValidator.isAuthorized,AuthValidator.isUser,cartValidator.getCartValidation,CartController.getCartById);
routes.post("/addToCart",AuthValidator.isAuthorized,AuthValidator.isUser,cartValidator.cartValidation,CartController.addToCart);
routes.post("/removeFromCart",AuthValidator.isAuthorized,AuthValidator.isUser,cartValidator.cartValidation,CartController.removeFromCart);
routes.post("/checkOut",AuthValidator.isAuthorized,AuthValidator.isUser,CartController.checkOut);

module.exports = routes;