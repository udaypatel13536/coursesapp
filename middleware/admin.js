const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const {adminModel} = require("../db");





async function adminMiddleware(req, res, next ) {
   try{
        const token = req.headers.token;
        const decoded = await new Promise((resolve , reject)=>{
            jwt.verify(token,JWT_ADMIN_PASSWORD,(err,decoded)=>{
                if(err){
                   return reject( res.json({
                        massage : "incorrect Creds!"

                    }))
                }
                resolve(decoded)
            })
        })
            const verifyBY = await adminModel.findOne({_id :decoded.id ,verify:true})
            if(!verifyBY){
              res.status(403).json({
                    massage :"You are not approve by superadmin!"
                });
            }else{
                req.userId = decoded.id
                next();
            }
        
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    adminMiddleware: adminMiddleware
}