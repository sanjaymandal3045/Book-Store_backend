const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

    reviews:{
        type:[
            {
                reviewMessage:{
                    type: String,
                    maxLength: 200,
                    required: true,
                },
                reviewStars:{
                    type: Number,
                    required: true,
                },
                userId: {
                    type: mongoose.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                _id: false,
            },
        ]
    },
    productId:{
        type:mongoose.Types.ObjectId,
        ref: "books",
        required:true,
    },
    averageRating:{
        type:Number,
        required:false,
    }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;