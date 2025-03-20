import jwt from "jsonwebtoken";

// doctor authentication middleware

const authDoctor = async (req, res, next) => {
    try {

        //logic to verify the token
        const {dtoken} = req.headers;
        if(!dtoken){
            return res.json({success:false, message:"Not authorized Login Again"});
        }
        
        // verify token , token_decode -> doctoremail+ password
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);

        // added userid with token in usercontroller while loginapi
        req.body.docId = token_decode.id;

        //if matched call the callback next()
        next();

        
    } catch (error) {
        console.log(error);
        res.status(500).send("Error in admin authentication of admin middleware");
    }
}

export default authDoctor;