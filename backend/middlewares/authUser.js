import jwt from "jsonwebtoken";

// user authentication middleware

const authUser = async (req, res, next) => {
    try {

        //logic to verify the token
        const {token} = req.headers;
        if(!token){
            return res.status(401).json({success:false, message:"Not authorized Login Again"});
        }
        
        // verify token , token_decode -> adminemail+ password
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // added userid with token in usercontroller while loginapi
        req.body.userId = token_decode.id;

        //if matched call the callback next()
        next();

        
    } catch (error) {
        console.log(error);
        res.status(500).send("Error in admin authentication of admin middleware");
    }
}

export default authUser;