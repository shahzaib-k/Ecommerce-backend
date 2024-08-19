import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { connectDB } from "./db/index.js"
import bodyParser from "body-parser"
import { userRouter } from "./routes/user.routes.js"
import { productRouter } from "./routes/product.routes.js"
import { adminRouter } from "./routes/admin.routes.js"
import { emailRouter } from "./routes/email.routes.js"


const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/products", productRouter)

app.use(express.json())
app.use(express.urlencoded({extended: true, limit : "50kb"}))  // file/image upto 50kb will only be uploaded. when we also increase it   
app.use(cookieParser())
app.use(bodyParser.json())

app.use("/auth", userRouter)
app.use("/admin", adminRouter)
app.use("/email", emailRouter)

connectDB().then(() => {
    app.listen("3000" , () => {
        console.log(`Server is running on port 3000`)
    })
}).catch((err) => {
    console.log(err);
});



