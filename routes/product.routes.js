import express from "express"
import { addToCart, cancel, checkout, complete, deleteCartItems, deleteProduct, deletePurchasedProducts, getProducts, hooks,
     updateCart, uploadProducts } from "../controllers/product.controller.js"
import { upload } from "../middleware/multer.middleware.js"
import { getAdminToken, getToken } from "../middleware/token.middleware.js"
import bodyParser from "body-parser"

const productRouter = express.Router()

productRouter.post("/hooks", bodyParser.raw({type: 'application/json'}), hooks)
productRouter.use( express.json())

productRouter.post("/upload", upload.single('image'), uploadProducts)
productRouter.get("/get-products",  getProducts)
productRouter.post("/add-to-cart/:id",  addToCart)
productRouter.delete("/delete-cart-items/:id", getToken, deleteCartItems )
productRouter.delete("/delete-product/:id", getAdminToken, deleteProduct)
productRouter.patch("/update-cart/:id", getToken, updateCart )
productRouter.post("/checkout", checkout)
productRouter.get("/complete", complete)
productRouter.get("/cancel", cancel)
productRouter.delete("/delete-purchased-products/:id",   deletePurchasedProducts )


export {productRouter}