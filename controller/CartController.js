const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const ProductModel = require("../model/Product");
const { success, failure } = require("../util/common");
const UserModel = require("../model/user");
const CartModel = require("../model/cart");
const logger = require("../util/log");
const transactionModel = require("../model/transaction");
const HTTP_STATUS = require("../constants/statusCodes");
const ReviewModel = require("../model/review");

class CartClass {

  async getCartById(req, res) {
    try {
      const { userId } = req.body;

      const Validation = validationResult(req).array();
      if (Validation.length > 0) {
        return res.status(422).send(failure("Invalid input", Validation));
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(400).send(failure("User id does not exist"));
      }

      let cart = await CartModel.findOne({ user: userId });
      if(cart.products.length>0){
        return res.status(200).send(success("Successfully got cart products", cart.products));
      }else{
        return res.status(400).send(failure("No Products in the cart"));
      }
    } catch (error) {
      console.error("Error:", error.message);
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res.status(500).send(failure("Server Error"));
    }
  }

  async addToCart(req, res) {
    try {
      const { userId, productid, quantity } = req.body;

      // console.log(quantity);

      const Validation = validationResult(req).array();
      if (Validation.length > 0) {
        return res.status(422).send(failure("Invalid input", Validation));
      }

      const apiRoute = req.originalUrl + " || " + "Status: Successfully accessed ";
      logger.logMessage(apiRoute);

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(400).send(failure("User id does not exist"));
      }

      const product = await ProductModel.findById(productid);
      if (!product) {
        return res.status(400).send(failure("Product id invalid"));
      }


      let cart = await CartModel.findOne({ user: userId });

      if(cart){
        if(cart.products.length>0){
          if (product.stock < (quantity + cart.products[0].quantity)) {
            return res.status(400).send(failure("Product stock invalid"));
          }
        }else{
          if (product.stock < quantity ) {
            return res.status(400).send(failure("Product stock invalid"));
          }
        }
      }

      console.log("cart:::::::::",cart);

      if (!cart) {
        cart = await CartModel.create({
          user: userId,
          products: [
            {
              product: productid,
              quantity: quantity,
            },
          ],
          total: product.price * quantity,
        });
      } else {

        

        const existingProduct = cart.products.find(
          (item) => String(item.product) === productid
        );

        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          cart.products.push({
            product: productid,
            quantity: quantity,
          });
        }

        cart.total = cart.total + quantity * product.price;

        await cart.save();
      }

      return res.status(200).send(success("Successfully added to cart", cart));
    } catch (error) {
      console.error("Error:", error);
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res.status(500).send(failure("Server Error"));
    }
  }

  async removeFromCart(req, res) {
    try {
      const { userId, productid, quantity } = req.body;

      const Validation = validationResult(req).array();
      if (Validation.length > 0) {
        return res.status(422).send(failure("Invalid input", Validation));
      }

      const apiRoute = req.originalUrl + " || " + "Status: Successfully accessed ";
      logger.logMessage(apiRoute);

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(400).send(failure("User id does not exist"));
      }

      const product = await ProductModel.findById(productid);
      if (!product) {
        return res.status(400).send(failure("Product id invalid"));
      }

      const cart = await CartModel.findOne({ user: userId });

      if(cart){
        if(cart.products.length>0){
          if (product.stock < (quantity + cart.products[0].quantity)) {
            return res.status(400).send(failure("Product stock invalid"));
          }
        }else{
          if (product.stock < quantity ) {
            return res.status(400).send(failure("Product stock invalid"));
          }
        }
      }

      if (!cart || cart.products.length<1) {
        return res.status(400).send(failure("User does not have a cart Or Does not have any product in the cart"));
      }

      const cartProductIndex = cart.products.findIndex(
        (item) => String(item.product) === productid
      );
      if (cartProductIndex === -1) {
        return res.status(400).send(failure("Product is not in the cart"));
      }

      const cartProduct = cart.products[cartProductIndex];

      console.log(cartProduct);
      if (cartProduct.quantity > quantity) {
        cartProduct.quantity -= quantity;
      } else {
        cart.products.splice(cartProductIndex, 1);
      }

      cart.total = cart.total - quantity * product.price;

      await cart.save();

      return res
        .status(200)
        .send(success("Successfully removed from cart", cart));
    } catch (error) {
      console.error("Error:", error);
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res.status(500).send(failure("Server Error"));
    }
  }

  async checkOut(req, res) {
    try {
      const { userId } = req.body;

      const apiRoute = req.originalUrl + " || " + "Status: Successfully accessed ";
      logger.logMessage(apiRoute);

      const user = await UserModel.findById(userId);
      // console.log("USER:::::::::::::::::",user);
      if (!user) {
        return res.status(400).send(failure("User id does not exist"));
      }

      const cart = await CartModel.findOne({ user: userId });

      if (!cart) {
        return res.status(400).send(failure("User does not have a cart"));
      } else {

        console.log(user.balance,cart.total);
        if(user.balance<cart.total){
          const balanceDiff = cart.total - user.balance;
          return res.status(400).send(failure(`insufficient balance, please add more ${balanceDiff} BDT`));
        }

        const newTransaction = await transactionModel.create({
          user : userId,
          products: cart.products,
          total: cart.total
        })

        for (const productInfo of cart.products) {
          const productid = productInfo.product; 
          const quantity = productInfo.quantity; 
    
          const product = await ProductModel.findById(productid);

          console.log("product",product);
    
          if (!product) {
            console.error(`Product with ID ${productid} not found`);
            continue; 
          }
    
          product.stock -= quantity; 
    
          await product.save();
    
        }

        user.balance = user.balance - cart.total;
        cart.products = [];
        cart.total = 0;
        await cart.save();
        await user.save();

        return res.status(200).send(success("Checked Out Successfully, New transaction created.",newTransaction));
      }
    } catch (error) {
      console.error("Error:", error);
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res.status(500).send(failure("Server Error"));
    }
  }
}

module.exports = new CartClass();
