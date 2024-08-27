import jwt from "jsonwebtoken"
import { Admin } from "../model/admin.model.js"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config()


const register = async (req, res) => {

    const {name, email, password} = req.body

    try {
        
        const user = await Admin.findOne({email})

        if(user){
            return res.status(409).json({message: "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = Admin({name, email, password: hashedPassword})

        await newUser.save()

        res.status(201).json({message: "Admin created successfully"})

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

const login = async (req, res) => {

    const {email, password} = req.body

    try {

        const user = await Admin.findOne({email})

        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect){
            return res.status(401).json({message: "Invalid Credientials"})
        }

        const access_token =  jwt.sign({Id: user._id} , process.env.ADMIN_SECRET_KEY, {expiresIn: "5h"}  )
 
        return res.cookie("access_token", access_token ,{httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000} ).status(200).json({message: "Logged In successfully", access_token})

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const verifyToken = async (req, res) => {

    const userId = req.userId

    try {
        
        const user = await Admin.findById(userId)

        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        res.status(200).json({message: "User found", user})

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export {register, login, verifyToken}