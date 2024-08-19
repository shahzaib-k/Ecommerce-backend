import express from "express" 
import { login, register, verifyToken } from "../controllers/admin.controller.js"
import { getAdminToken } from "../middleware/token.middleware.js"

const adminRouter = express.Router()

adminRouter.post("/register", register )
adminRouter.post("/login", login )
adminRouter.get("/verify-token", getAdminToken, verifyToken )


export {adminRouter}