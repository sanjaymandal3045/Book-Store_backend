const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HTTP_STATUS = require("../constants/statusCodes");
const { success, failure } = require("../util/common");
const UserModel = require("../model/user");
const AuthModel = require("../model/Auth");
const discountModel = require("../model/Discount");
const ProductModel = require("../model/Product");
const CartModel = require("../model/cart");
const ReviewModel = require("../model/review");
const logger = require("../util/log");
const Product = require("../model/Product");

class Admin {
  async getAllUsers(req, res) {
    try {
      const apiRoute =
        req.originalUrl + " || " + "Status: Successfully accessed ";
      logger.logMessage(apiRoute);

      const allUsers = await UserModel.find({ access: "user" }).select(
        "-access -balance"
      );
      if (allUsers.length > 0) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully received all Users", allUsers));
      }

      return res.status(HTTP_STATUS.NOT_FOUND).send(success("No Users found"));
    } catch (error) {
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  async updateUserData(req, res) {
    try {
      const { userId, name, access } = req.body;
      const apiRoute =
        req.originalUrl + " || " + "Status: Successfully accessed ";
      logger.logMessage(apiRoute);

      const user = await UserModel.findOne({ _id: userId }).select(
        "-phoneNo -balance"
      );

      if (user) {
        if (name) {
          user.name = name;
        }
        if (access) {
          user.access = access;
        }
        await user.save();

        return res
          .status(HTTP_STATUS.OK)
          .send(success(`Successfully edited user`, user));
      } else {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(success("No Users found"));
      }
    } catch (error) {
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  async deleteUserData(req, res) {
    try {
      const { userId } = req.body;
      const apiRoute =
        req.originalUrl + " || " + "Status: Successfully accessed ";
      logger.logMessage(apiRoute);

      const deleteAuthentications = await AuthModel.deleteOne({ user: userId });
      const deleteCarts = await CartModel.deleteOne({ user: userId });
      const deleteReviews = await ReviewModel.updateMany(
        {},
        {
          $pull: {
            reviews: { userId: userId },
          },
          // $set: {
          //   averageRating: 0, 
          // },
        }
      )
      const deleteUser = await UserModel.deleteOne({ _id: userId });

      ///-------Transaction not delete because its sensible data

      if (deleteUser && deleteAuthentications) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success(`Successfully deleted user`));
      } else {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(success("No Users found"));
      }
    } catch (error) {
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  async editBookData(req, res) {
    try {
      const apiRoute = req.originalUrl + " || " + "Status: Successfully accessed ";
      logger.logMessage(apiRoute);

      const { bookId, genre, synonyms, demographic, price, stock, author, releaseDate } = req.body;

      const editItems = {};

      const book = await ProductModel.findOne({ _id: bookId });

      if (!book) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(error("Book not found"));
      }

      console.log("BOOk:", book);

      if (genre) {
        book.genre = genre;
      }
      if (synonyms) {
        book.synonyms = synonyms;
      }
      if (demographic) {
        book.demographic = demographic;
      }
      if (price) {
        book.price = price;
      }
      if (stock) {
        book.stock = stock;
      }
      if (author) {
        book.author = author;
        // editItems['author'] = author;
      }
      if (releaseDate) {
        book.releaseDate = releaseDate;
        // editItems['releaseDate'] = releaseDate;
      }

      await book.save();
      // console.log(editItems);

      // const updatedBook = await ProductModel.updateOne(
      //   { _id: bookId }, // Filter criteria based on bookId
      //   { $set: editItems } // Update object
      // );

      if (book) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Book successfully updated", book));
      }

      return res.status(HTTP_STATUS.NOT_FOUND).send(failure("No updates were made"));

    } catch (error) {
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  async addNewBook(req, res) {
    try {
      const apiRoute = req.originalUrl + " || " + "Status: Successfully accessed ";
      logger.logMessage(apiRoute);

      const { name, genre, synonyms, demographic, price, stock, author, releaseDate } = req.body;

      const newBookProperties = {};

      const book = await ProductModel.findOne({ name: name });

      if (book) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Book name already exists"));
      }

      if (name) {
        newBookProperties.name = name;
      }
      if (genre) {
        newBookProperties.genre = genre;
      }
      if (synonyms) {
        newBookProperties.synonyms = synonyms;
      }
      if (demographic) {
        newBookProperties.demographic = demographic;
      }
      if (price) {
        newBookProperties.price = price;
      }
      if (stock) {
        newBookProperties.stock = stock;
      }
      if (author) {
        newBookProperties.author = author;
      }
      if (releaseDate) {
        newBookProperties.releaseDate = releaseDate;
      }

      console.log(newBookProperties);

      const newBook = await ProductModel.create(newBookProperties);

      const newBookDiscount = await discountModel.create({
        discounts: [
          {
            startTime: new Date(),
            endTime: new Date(),
            discountAmount:0,
          }
        ],
        productId: newBook._id,
      })

      if (newBook && newBookDiscount) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("New Book added successfully!!", newBook));
      }

      return res.status(HTTP_STATUS.NOT_FOUND).send(failure("No new book was added"));
    } catch (error) {
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  async addDiscount(req, res) {
    try {
      const { productId, startDate, endDate, discountAmount } = req.body;
      const apiRoute =
        req.originalUrl + " || " + "Status: Successfully accessed ";
      logger.logMessage(apiRoute);

      const discountedProduct = await discountModel.findOne({ productId: productId });
      console.log("discountedProduct",discountedProduct);
      if (!discountedProduct) {
        const discountData = await discountModel.create({
          productId: productId, // Replace with the actual productId
          discounts: [
            {
              startTime: new Date(startDate),
              endTime: new Date(endDate), 
              discountAmount: discountAmount, 
            },
          ],
        });
        console.log(discountData);

        return res
          .status(HTTP_STATUS.OK)
          .send(success(`Successfully added discount`, discountData));
        
      } else {

        const discountData = await discountModel.findOneAndUpdate(
          { productId: productId },
          {
            $push: {
              discounts: {
                startTime: new Date(startDate),
                endTime: new Date(endDate),
                discountAmount: discountAmount,
              },
            },
          },
          { new: true } // Return the updated document
        );
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Product found",discountData));
      }
    } catch (error) {
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }


}

module.exports = new Admin();
