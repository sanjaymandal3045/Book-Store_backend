const { validationResult } = require("express-validator");
const ProductModel = require("../model/Product");
const { success, failure } = require("../util/common");
const HTTP_STATUS = require("../constants/statusCodes");
const logger = require("../util/log");
const discountModel = require("../model/Discount");
const mongoose = require("mongoose");
const UserModel = require("../model/user");
const CartModel = require("../model/cart");
const transactionModel = require("../model/transaction");

const Cart = require("../model/cart");
const ReviewModel = require("../model/review");

class Product {

  async getAll(req, res) {
    try {
      const apiRoute = req.originalUrl + " || " + "Status: Successfully accessed ";
      logger.logMessage(apiRoute);

      const allProducts = await ProductModel.find({});

      // const currentTime = new Date().toISOString();
      // const dateObj = new Date(currentTime);
      // const year = dateObj.getFullYear();
      // const month = dateObj.getMonth() + 1; // Months are 0-indexed, so add 1
      // const day = dateObj.getDate();
      // const hour = dateObj.getHours();
      // const minute = dateObj.getMinutes();
      // const second = dateObj.getSeconds();

      // const currentTime1 =  `${day}-${month}-${year} ${hour}:${minute}:${second}`;

      const currentTime2 = new Date("2023-05-01 01:20:45");

      const currentTime = new Date();

      if(currentTime>currentTime2){
        console.log("currentTime<currentTime2");
      }
      

      if (allProducts.length > 0) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully received all products", allProducts));
      }

      return res.status(HTTP_STATUS.NOT_FOUND).send(success("No Products found"));
    } catch (error) {
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async filterProducts(req, res) {
    try {
      const Validation = validationResult(req).array();
      if (Validation.length > 0) {
        return res.status(422).send(failure("Invalid input", Validation));
      }

      const apiRoute = req.originalUrl + " || " + "Status: Successfully accessed ";
      logger.logMessage(apiRoute);

      let product = ProductModel.find();    //Throws error if await is declared here!!!
      // product = product.toObject();

      console.log(product.length)

      // const products = await ProductModel.getAll();
      let totalData = 0;
      let {
        page,
        limit,
        sortOrder,
        sortParams,
        search,
        price,
        priceFill,
        stock,
        stockFill,
        releaseDate,
        releaseDateFill,
        authorNames,
        genre,
      } = req.query;

      if (!page || !limit) {
        page = 1;
        limit = 3;
      }

      if (page < 1 && limit < 0) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Page values must be => 1 and Limit can not be 0"));
      }
      // users = await ProductModel.find().skip((page - 1)*limit).limit(limit);
      console.log("page....", page);

      if (sortOrder && sortParams) {
        if (
          sortParams === "price" ||
          sortParams === "stock" ||
          sortParams === "name"
        ) {
          if (sortOrder === "asc") {
            const sort = {};
            sort[sortParams] = 1;
            product = product.sort(sort);

          } else if (sortOrder === "desc") {
            const sort = {};
            sort[sortParams] = -1;
            product = product.sort(sort);
          } else {
            return res
              .status(400)
              .send(failure("Invalid Input at sortingOrder"));
          }
        } else {
          return res.status(400).send(failure("Invalid Input at sortParams"));
        }
      }

      if (stock && stockFill) {
        if (stockFill === "higher") {
          product = product.find({ stock: { $gt: stock } });
        } else if (stockFill === "lower") {
          product = product.find({ stock: { $lt: stock } });
        } else {
          return res.status(400).send(failure("Invalid Input at stockFill"));
        }
      }

      if (price && priceFill) {
        if (priceFill === "higher") {
          product = product.find({ price: { $gt: price } });
        } else if (priceFill === "lower") {
          product = product.find({ price: { $lt: price } });
        } else {
          return res.status(400).send(failure("Invalid Input at stockFill"));
        }
      }

      if (releaseDate && releaseDateFill) {
        if (releaseDateFill === "higher") {
          product = product.find({ releaseDate: { $gt: releaseDate } });
        } else if (releaseDateFill === "lower") {
          product = product.find({ releaseDate: { $lt: releaseDate } });
        } else {
          return res.status(400).send(failure("Invalid Input at stockFill"));
        }
      }

      if (search) {
        product = product.find({
          $or: [
            { name: { $regex: search, $options: "i" } },
            { synonyms: { $regex: search, $options: "i" } },
            { author: { $regex: search, $options: "i" } },
            { demographic: { $regex: search, $options: "i" } },
          ],
        });
      }

      if (authorNames) {
        const authors = authorNames.split(",");

        product = product.find({
          author: { $in: authors },
        });
      }

      if (genre) {
        const genres = genre.split(",");

        product = product.find({
          genre: { $in: genres },
        });
      }


      const skipAmount = (page - 1) * limit;
      product = product.skip(skipAmount).limit(limit);

      const filteredProducts = await product.exec();

      console.log(filteredProducts.length);
      if (filteredProducts.length > 0) {

        return res
          .status(200)
          .send(
            success("Successfully received all products", filteredProducts)
          );
      }


      return res.status(200).send(success("No Products were found"));
    } catch (error) {
      console.log(error.message);
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res.status(500).send(failure("Internal server error"));
    }
  }

}

module.exports = new Product();
