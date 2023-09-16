const express = require("express");
const routes = express();
const ReviewController = require("../controller/ReviewController");
const AuthValidator = require("../middleware/auth");

routes.post("/addReview",AuthValidator.isAuthorized, AuthValidator.isUser, ReviewController.addReview);
routes.post("/getReviewByUser",AuthValidator.isAuthorized, AuthValidator.isUser, ReviewController.getReviewByUser);
routes.post("/getReviewByProduct",ReviewController.getReviewByProduct);
routes.post("/removeReviewByUser",AuthValidator.isAuthorized, AuthValidator.isUser, ReviewController.removeReview);



module.exports = routes;