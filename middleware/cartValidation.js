const { failure } = require("../util/common");
const { body, query, param } = require("express-validator");

const cartValidator = {
  cartValidation: [
    body("userId")
      .exists()
      .withMessage("userId not provided")
      .bail()
      .not()
      .equals("")
      .withMessage("userId was not provided in the property")
      .bail()
      .isString()
      .withMessage("userId should be string"),

    body("productid")
      .exists()
      .withMessage("productid not provided")
      .bail()
      .notEmpty()
      .withMessage("productid was not provided in the property")
      .bail()
      .isString()
      .withMessage("productid should be string"),

    body("quantity")
      .exists()
      .withMessage("quantity not provided")
      .bail()
      .notEmpty()
      .withMessage("quantity was not provided in the property")
      .bail()
      .isNumeric()
      .withMessage("quantity should be Number"),
  ],

  getCartValidation:[
    body("userId")
      .exists()
      .withMessage("userId not provided")
      .bail()
      .notEmpty()
      .withMessage("userId was not provided in the property")
      .bail()
      .isString()
      .withMessage("userId should be string"),
  ]
};

module.exports = cartValidator;
