const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const ProductModel = require("../model/Product");
const { success, failure } = require("../util/common");
const UserModel = require("../model/user");
const logger = require("../util/log");
const CartModel = require("../model/cart");
const transactionModel = require("../model/transaction");
const HTTP_STATUS = require("../constants/statusCodes");
const Cart = require("../model/cart");
const ReviewModel = require("../model/review");

class Review {
  async addReview(req, res) {
    try {
      const { reviewMessage, reviewStars, userId, productId } = req.body;
      let totalStars, average;

      console.log(reviewMessage, reviewStars, userId, productId);

      const apiRoute = req.originalUrl + " || " + "Status: Successfully accessed ";
      logger.logMessage(apiRoute);

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(400).send(failure("User id does not exist"));
      }

      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(400).send(failure("Product id invalid"));
      }


      //Checking if the user has brought the product or not
      const isbrought = await transactionModel.findOne({
        user: userId,
        'products.product': productId,
      })
      if (isbrought) {
        console.log("Brought!!!", isbrought);
      }
      else {
        return res
          .status(400)
          .send(success("Buy the product to give a review!!"));
      }


      let existingReview = await ReviewModel.findOne({
        productId: productId,
      });

      let existingReviewForUser = await ReviewModel.findOne({
        productId: productId,
        "reviews.userId": userId,
      });

      // console.log("existing review::::::::::  ", existingReview.reviews.userId);

      if (!existingReview) {
        existingReview = await ReviewModel.create({
          reviews: [
            {
              reviewMessage: reviewMessage,
              reviewStars: reviewStars,
              userId: userId,
            },
          ],
          productId: productId,
          averageRating: reviewStars,
        });

        await existingReview.save();
        return res
          .status(200)
          .send(success("Successfully added to Reviews", existingReview));
      } else if (existingReviewForUser) {
        await ReviewModel.updateOne(
          {
            _id: existingReview._id, // Use the _id to identify the review
            "reviews.userId": userId,
          },
          {
            $set: {
              "reviews.$.reviewMessage": reviewMessage,
              "reviews.$.reviewStars": reviewStars,
            },
          }
        );

        // Recalculate the averageRating
        const updatedReview = await ReviewModel.findById(existingReview._id);
        let totalStars = 0;
        updatedReview.reviews.forEach((review) => {
          totalStars += review.reviewStars;
        });
        updatedReview.averageRating = totalStars / updatedReview.reviews.length;

        // Save the updated review
        await updatedReview.save();
        return res
          .status(200)
          .send(success("Successfully edited to Reviews", updatedReview));
        // console.log("existing review 2::::");
      } else {
        const newReview = {
          reviewMessage: reviewMessage,
          reviewStars: reviewStars,
          userId: userId,
        };

        const newAverageRating =
          (existingReview.averageRating * existingReview.reviews.length +
            reviewStars) /
          (existingReview.reviews.length + 1);

        const updatedReview = await ReviewModel.findOneAndUpdate(
          { productId: productId },
          {
            $push: { reviews: newReview },
            averageRating: newAverageRating,
          },
          { upsert: true, new: true }
        );

        return res
          .status(200)
          .send(success("Successfully appended to Reviews", updatedReview));
      }
    } catch (error) {
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res.status(500).send(failure("Internal server error"));
    }
  }

  async removeReview(req, res) {
    try {
      const { productId, userId } = req.body;

      const apiRoute = req.originalUrl + " || " + "Status: Successfully accessed ";
      logger.logMessage(apiRoute);

      const existingReview = await ReviewModel.findOne({
        productId: productId,
        "reviews.userId": userId,
      });

      if (existingReview) {
        existingReview.reviews = existingReview.reviews.filter(
          (review) => !review.userId.equals(userId)
        );

        if (existingReview.reviews.length === 0) {
          existingReview.averageRating = 0;
        } else {
          const totalStars = existingReview.reviews.reduce(
            (sum, review) => sum + review.reviewStars,
            0
          );
          existingReview.averageRating =
            totalStars / existingReview.reviews.length;
        }

        await existingReview.save();

        return res
          .status(200)
          .send(
            success(
              "Successfully removed product Reviews",
              existingReview.reviews
            )
          );
      } else {
        return res.status(400).send(failure("No reviews found"));
      }
    } catch (error) {
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res.status(500).send(failure("Internal server error"));
    }
  }

  async getReviewByProduct(req, res) {
    try {
      const { productId } = req.body;

      const apiRoute = req.originalUrl + " || " + "Status: Successfully accessed ";
      logger.logMessage(apiRoute);

      if (productId) {
        const reviewsByProducts = await ReviewModel.findOne({ productId });

        if (reviewsByProducts) {
          return res
            .status(200)
            .send(
              success(
                "Successfully retrieved all product Reviews",
                reviewsByProducts.reviews
              )
            );
        } else {
          return res.status(400).send(failure("No product Reviews found"));
        }
      }
    } catch (error) {
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res.status(500).send(failure("Internal server error"));
    }
  }

  async getReviewByUser(req, res) {
    try {
      const { userId } = req.body;

      const apiRoute = req.originalUrl + " || " + "Status: Successfully accessed ";
      logger.logMessage(apiRoute);

      console.log(userId);
      if (userId) {
        const reviewsByUser = await ReviewModel.find({
          "reviews.userId": userId,
        })
          .populate("reviews.userId", "name email")
          .populate("productId", "name price");
        let filteredReviews = [];

        if (reviewsByUser.length > 0) {
          console.log("Products with userId:", userId);
          reviewsByUser.forEach((products) => {
            const userReviews = products.reviews.filter((review) =>
              review.userId.equals(userId)
            );
            filteredReviews.push({
              userReviews,
              productId: products.productId,
            });
            // console.log("Filtered Reviews:", filteredReviews);
          });
          return res
            .status(200)
            .send(
              success(
                "Successfully retrieved all product Reviews by userId",
                filteredReviews
              )
            );
        } else {
          console.log("No products found for userId:", userId);
          return res
            .status(400)
            .send(failure(`No product Reviews found for userId: '${userId}'`));
        }
      }
    } catch (error) {
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res.status(500).send(failure("Internal server error"));
    }
  }
}

module.exports = new Review();
