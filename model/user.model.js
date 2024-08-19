import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      productImage: {
        type: String, // Assuming productImage is a URL or path to the image
        required: true
      },
      productSize : {
         type: String,
      },
      quantity : {
         type: Number,
         required: true
      }, 
      productTitle : {
         type: String,
         required: true
      },
      color : {
         type : String, 
      },
      productPrice : {
         type : Number, 
         required : true
      }
    }
  ],
  purchaseProducts : [
    {
      id : {
        type: String,
        required: true
      },
      price : {
        type: Number,
        required: true
      },
      quantity : {
        type: Number,
        required: true
      },
      title : {
        type: String,
        required: true
      },
      image: {
        type: String, 
        required: true
      },
      size : {
        type: String,
        required: true
      },
      // productInvoice : {
      //   type: String,
      //   required: true
      // }

    }
  ]

});

export const User = mongoose.model("User", UserSchema);
