import express from "express"
import { Subscribe } from "../controllers/email.controller.js"

const emailRouter = express.Router()

emailRouter.get("/subscribe", Subscribe)


export {emailRouter}