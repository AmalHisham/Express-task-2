import jwt from 'jsonwebtoken'

export const protect = (req,res,next) => {

    const token = req.headers.authorization

    if(!token) {
        res.status(400).json({message : "Not authorized"})
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.admin = decoded
        next()
    }

    catch(err) {
        res.status(400).json({message : "Invalid token"})
    }
}