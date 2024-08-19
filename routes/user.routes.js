import express from "express"
import { login, register, verifyToken} from "../controllers/user.controller.js"
import { getToken } from "../middleware/token.middleware.js"

const userRouter = express.Router()

userRouter.post("/register", register)
userRouter.post("/login", login)
userRouter.get("/verify-token", getToken, verifyToken)

export {userRouter}