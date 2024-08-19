import jwt from "jsonwebtoken"

const getToken  = async (req, res, next) => {

    const {token} = req.cookies


    try {
   
        if(!token){
            return res.status(401).json({message: "Token not found"})
        }
        
        const user = await jwt.verify(token, "MY_KEY")

         req.userId =  user.Id

        next()
    } catch (error) {
        console.log(error);
    }
}


const getAdminToken = async (req, res, next) => {
 
    const {access_token} = req.cookies
    
    try {
        
        if(!access_token){
            return res.status(401).json({message: "Token not found"})
        }
        
        const user = await jwt.verify(access_token, "MY_SERET_KEY")
        
        req.userId =  user.Id
        
        next()
    } catch (error) {
        console.log(error);
    }
    
    
}


export {getToken, getAdminToken}