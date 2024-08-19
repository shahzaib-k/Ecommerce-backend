import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";


// Configuration
cloudinary.config({ 
    cloud_name: 'dxv0y4eyv', 
    api_key: '833562344344472', 
    api_secret: 'sEXwg6emkN9-Kf-fUkUObPviwyM' // Click 'View Credentials' below to copy your API secret
})


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        //upload file on cloudinary

        const response = await cloudinary.uploader.upload(
            localFilePath, { resource_type : "auto"}
        )
        
        //file has been uploaded successfully

        console.log('file has been uploaded ', response.url);
        fs.unlinkSync(localFilePath)
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file 
                                     // as the operation got failed           
        return null; 
    }
}

export {uploadOnCloudinary}