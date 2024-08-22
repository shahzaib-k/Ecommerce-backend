import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { connectDB } from "./db/index.js"
import bodyParser from "body-parser"
import { userRouter } from "./routes/user.routes.js"
import { productRouter } from "./routes/product.routes.js"
import { adminRouter } from "./routes/admin.routes.js"
import dotenv from "dotenv"
dotenv.config()


const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(cookieParser())
app.use("/products", productRouter)

app.use(express.json())
app.use(express.urlencoded({extended: true, limit : "50kb"}))  // file/image upto 50kb will only be uploaded   
app.use(bodyParser.json())


app.use("/auth", userRouter)
app.use("/admin", adminRouter)

connectDB().then(() => {
    app.listen(process.env.PORT , () => {
        console.log(`Server is running on port ${process.env.PORT}`)        
    })
}).catch((err) => {
    console.log(err);
});



