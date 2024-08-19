import { User } from "../model/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const register = async (req, res) => {

    const {name, email, password} = req.body

    try {
        const user = await User.findOne({email})

        if(user){
            return res.status(409).json({message: "Email already exists!"})
        }
    
        const hashedPassword = await bcrypt.hash(password, 10)
    
        const newUser = User({name, email, password: hashedPassword})
    
        await newUser.save()
    
        res.status(201).json({message: "User registered successfully"})

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error, please try again later." });
    }
   

}

const login = async (req, res) => {

    const {email, password} = req.body

    try {
        
        const user = await User.findOne({email})
    
        if(!user){
            return res.status(400).json({message: "Please provide a valid email"})
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
    
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"})
        }
    
        const token = jwt.sign({Id: user._id}, "MY_KEY", {expiresIn: '5h'})
    
        return res.status(200).cookie("token", token ).json({message: "Logged In successfully", token})
    
    } catch (error) {
       console.error(error)
       res.status(500).json({ message: "Server error, please try again later." });
    }
}

const verifyToken = async (req, res) => {
    const userId = req.userId;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "User found", user });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error, please try again later." });
    }
  };
  


export {register, login, verifyToken}

