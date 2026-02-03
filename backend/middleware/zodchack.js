const {z} =require('zod')

function checkImformtion(req,res,next){
    const requireBody = z.object({
        email:z.email(),
        password : z.string().min(8),
        firstName : z.string().min(2).max(20),
        lastName : z.string().min(2).max(20)
    })
    try{
        const parsedDatawithSuccess = requireBody.safeParse(req.body)
        if(parsedDatawithSuccess.success){
            next()
        }
    }catch(er){
        const parsedDatawithSuccess = requireBody.safeParse(req.body)
        if(!parsedDatawithSuccess.success){
            res.status(403).json({
                message: "INcorrect Formate!",
                error : parsedDatawithSuccess.error
            })
        }
    }
}

module.exports= {
    checkImformtion
}