import jwt from "jsonwebtoken";

// Admin authentication middleware

const authAdmin = async (req, res, next) => {
    try {

        //logic to verify the token
        const {atoken} = req.headers;
        if(!atoken){
            return res.status(401).json({success:false, message:"Not authorized Login Again"});
        }
        
        // verify token , token_decode -> adminemail+ password
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.status(401).json({success:false, message:"Not authorized Login Again"});   
        }

        //if matched call the callback next()
        next();

        
    } catch (error) {
        console.log(error);
        res.status(500).send("Error in admin authentication of admin middleware");
    }
}

export default authAdmin;