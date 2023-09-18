const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    discounts: [
        {
            startTime: {
                type: Date,
                required: true,
            },
            endTime: {
                type: Date,
                required: true,
            },
            discountAmount: {
                type: Number,
                required: false,
                default: 0
            },
            _id: false,
        },
    ],
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "books",
        required: true,
    },
});

const Discount = mongoose.model('discount', discountSchema);

module.exports = Discount;
