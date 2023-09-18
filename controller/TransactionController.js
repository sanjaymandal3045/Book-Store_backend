const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const ProductModel = require("../model/Product");
const { success, failure } = require("../util/common");
const transactionModel = require("../model/transaction");
const cartModel = require("../model/cart");
const productModel = require("../model/Product");
const User = require("../model/user");

class TransactionProduct {
  async getAllTransactionByUser(req, res) {
    try {
      const { userId } = req.body;
      let totalValue = 0;
      let transactionResult = await transactionModel
        .find({ user: userId }).select('-user')
        // .populate("user", "-access")
        .populate("products.product", "-stock");

      if (transactionResult.length > 0) {
        totalValue = transactionResult.reduce((sum, transaction) => {
          const { total } = transaction;
          return sum + total;
        }, 0);

        transactionResult.push({ "lifetime order amount ": totalValue });

        return res
          .status(200)
          .send(
            success("Successfully received all transactions", transactionResult)
          );
      } else {
        return res.status(400).send(success("No Transactions Found"));
      }
    } catch (error) {
      console.log("Found: " + error);
    }
  }

  async getAllTransactionByAdmin(req, res) {
    try {
      let totalValue = 0;
      let transactionResult = await transactionModel
        .find()//.select('-user')
        .populate("user", "-balance -access -_id")
        .populate("products.product", "-stock");

      if (transactionResult.length > 0) {
        totalValue = transactionResult.reduce((sum, transaction) => {
          const { total } = transaction;
          return sum + total;
        }, 0);

        transactionResult.push({ "lifetime order amount ": totalValue });

        return res
          .status(200)
          .send(
            success("Successfully received all transactions", transactionResult)
          );
      } else {
        return res.status(400).send(success("No Transactions Found"));
      }
    } catch (error) {
      console.log("Found: " + error);
    }
  }

  async createTransaction(req, res) {
    try {
      const { user, products } = req.body;

      const productId = products.map((ele) => ele.id);

      const isValidProductIds = products.every((ele) =>
        mongoose.Types.ObjectId.isValid(ele.id)
      );

      let productsData;
      if (!isValidProductIds) {
        console.log("One or more product IDs are invalid.");
      } else {
        productsData = await ProductModel.find({
          _id: { $in: productId },
        });

        console.log("Products Data:", productsData);
      }

      const total = 0;
      // console.log(".....................", gg);
      if (productsData) {
        const newTransactions = await transactionModel.create({
          user,
          products,
          total,
        });
        // console.log(newTransactions);

        if (newTransactions) {
          return res
            .status(200)
            .send(success("Successfully created new transaction"));
        }
      } else {
        return res.status(400).send(success("Product id invalid"));
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("internal server error"));
    }
  }
}

module.exports = new TransactionProduct();
