import mongoose from "mongoose"

const connectDB = async () => {
    
    try {
        await mongoose.connect("mongodb+srv://shahzaibkhan4659:shahz123@cluster0.qpwe4rp.mongodb.net/")
        console.log("Database connected")
        
    } catch (error) {
        console.log(error);
    }
}


export {connectDB}