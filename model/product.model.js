import mongoose from "mongoose"

const productSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    image : {
        type: [String],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    size: {
        type: [String],
        required: true
    },
    color : {
        type: [String],
        required: true
    }
})

export const Product = mongoose.model("Product", productSchema)