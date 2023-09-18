const mongoose = require("mongoose");
const booksSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, "name should be unique"],
        required: [true, "name was not provided"],
        maxLength: 30,
    },
    genre: [
        {
            type: String,
            required:[true, "genre was not provided"],
        },
    ],
    synonyms: [
        {
            type: String,
            required:false,
            default: this.name
        },
    ],
    demographic: {
        type: String,
        required: false,
        default: "Everyone"
    },
    price: {
        type: Number,
        min: 5,
        required: [true, "price was not provided"],
    },
    stock: {
        type: Number,
        min: 1,
        required: [true, "stock was not provided"],
    },
    author: {
        type: String,
        required: [true, "author name was not provided"],
        maxLength: 30,
    },
    releaseDate: {
        type: String,
        required: false,
    }

});

const Product = mongoose.model("books", booksSchema);
module.exports = Product;