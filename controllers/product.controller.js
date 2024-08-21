import bodyParser from "body-parser";
import { Admin } from "../model/admin.model.js";
import { Product } from "../model/product.model.js";
import { User } from "../model/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import dotenv from "dotenv";
import Stripe from 'stripe';
import express from "express";

const app = express()

dotenv.config();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

let cart

let userId
let purchasedProducts

const uploadProducts = async (req, res) => {

    const {title, description, price ,quantity, category, color, size } = req.body
    const imageLocalPath = req.file.path
        

    try {
        
        if(!imageLocalPath){
            return res.status(400).json({message: "Image is required"})
        }
        
        const image = await uploadOnCloudinary(imageLocalPath)
        
        if(!image){
            return res.status(501).json({message: "Image not uploaded on cloudinary"})
        }

        const product = await Product({title, description, price, quantity, size, category, 
             color , image : image.url})
        
        await product.save()

        return res.status(201).json({message: "product added successfully", product})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }

}

const getProducts = async (req, res) => {
    try {
        
        const product = await Product.find()

        return res.status(200).json({message: "products fetched successfully", product})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const addToCart = async (req, res) => {

    const userId = req.params.id
    const {productId, productImage, productSize, quantity, productTitle, color, productPrice} = req.body

    try {
        
        const product = await User.findById(userId)

        if(!product){
            return res.status(404).json({message: "User not found"})
        }

        await product.cart.push({productId, quantity, productImage, productTitle, productPrice, productSize, color})

        await product.save()

        res.status(200).json({message: "Added to cart successfully"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });      
    }

}

const deleteCartItems = async (req, res) => {

    const productId = req.params.id;
    const userId = req.userId

    try {        
        const user = await User.findById(userId)

        if(!user){
            return res.status(404).json({message: "user not found"})
        }

        const productIndex = user.cart.findIndex(item => item.productId.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        

        user.cart.splice(productIndex, 1);

        await user.save();

        res.status(200).json({ message: "Product deleted successfully from cart" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateCart = async (req, res) => {

    const {quantity} = req.body
    const productId = req.params.id
    const userId = req.userId

    try {
        const product = await User.findById(userId)

        if(!product){
            return res.status(404).json({message: "user not found"})
        }

        const newProduct = product.cart.filter( item => item.productId == productId )
        
        if(!newProduct){
            return res.status(404).json({message: "product not found in cart"})
        }

        newProduct[0].quantity = quantity 

        await product.save()

        res.status(200).json({message : "cart updated successfully"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }

}

const deleteProduct = async (req, res) => {
    const productId = req.params.id
    const userId = req.userId;

    try {
    const admin = await Admin.findById(userId) 
    const product = await Product.findById(productId)
    
   if(!admin){
    return res.status(404).json({message: "admin not found"})
   }

   if(!productId){
    return res.status(404).json({message: "Product not found"})
   }

   await product.deleteOne()

   res.status(200).json({message: "Product deleted successfully"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


const checkout = async (req, res) => {
    const { id, title, price, quantity, size, image } = req.body;

    const product = { id, title, price, quantity, size, image };

    const lineItems = title.map((itemTitle, index) => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: itemTitle,
                metadata : {
                    size: size[index],
                }, 
                images: [image[index]],
            },
            unit_amount: price[index] * 100,
        },
        quantity: quantity[index],
        
    }));

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            metadata: {
                cart: JSON.stringify(product)
            },
            success_url: `${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL}/cancel`,
            mode: 'payment',
            shipping_address_collection: {
                allowed_countries: ['US', 'PK']
            },
            invoice_creation: { enabled: true }
        });

        res.json(session);
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




    const complete = async (req, res) => {

        const sessionId = req.query.session_id;
    
        if (!sessionId) {
            return res.status(400).json({ message: "No session_id provided" });
        }
    
        try {
            const [session, lineItems] = await Promise.all([
                stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent.payment_method'] }),
                stripe.checkout.sessions.listLineItems(sessionId)
            ]);
    
            if (!session) {
                console.log('No result');
                return res.status(401).json({ message: "No result" });
            }
    
    
    
            res.json({ message: "Your payment is successful", session, lineItems });
        } catch (error) {
            console.error('Error retrieving session:', error);
            res.status(500).json({ message: "Internal server error", error });
        }
    }
    

    const cancel = async (req, res) => {
        res.json({ message: "Your payment is cancelled" })
    }


    const hooks = async (req, res) => {
        let signingSecret = process.env.STRIPE_SIGNING_SECRET;

        const payload = req.body;
        const sig = req.headers['stripe-signature'];

        console.log(payload);

        let event;

        try {
          event = stripe.webhooks.constructEvent(payload, sig, signingSecret);
           
        } catch (error) {
          console.log(error);
          return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        switch (event.type) {
          case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
             
            break;             

            case 'checkout.session.completed' :
                
            const session = event.data.object;
            const cart = JSON.parse(session.metadata.cart);
            userId = cart.id;

            try {
                const user = await User.findById(userId);
                if (user) {
                
                    const purchasedProducts = cart.title.map((_, index) => ({
                        id: cart.id[index],
                        title: cart.title[index],
                        price: cart.price[index],
                        quantity: cart.quantity[index],
                        size: cart.size[index],
                        image: cart.image[index],
                    }));
                
                    user.purchaseProducts.push(...purchasedProducts);
                    
                    user.cart = [];
                    await user.save();

                    console.log("items from cart deleted and added to purchase products", userId );
                    
                }
            
            } catch (error) {
                console.error(`Error processing purchase for user ${userId}:`, error);
            }
            break;

        default:
    }

    res.json({ success: true, message: "Success" });
};


const deletePurchasedProducts = async (req, res) => {
   
    const userId = req.params.id 

    const user = await User.findById(userId)
    
    if(!user){
        return res.status(400).json({message: "User not found"})
    }

    user.purchaseProducts = []

    await user.save()

    res.status(200).json({message: "purchase products deleted"})
};



export {uploadProducts, getProducts, addToCart, deleteCartItems, updateCart, deleteProduct, checkout, 
complete, cancel, hooks, deletePurchasedProducts }