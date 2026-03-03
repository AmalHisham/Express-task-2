import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import bycrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Admin from './models/Admin.js'

import multer from 'multer'

import  {protect} from './middleware/authMiddleware.js'
import User from './models/User.js'


const app = express()

app.use(express.json())

dotenv.config()

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err))


app.get("/", (req,res) => {
    res.json({message : "mahn!!!, this is working"})
})



app.post('/register', async (req,res) => {

    const {email,password} = req.body

    const hashedPassword = await bycrypt.hash(password,10)

    const admin = new Admin ({
        email,
        password : hashedPassword
    })
 
    await admin.save()

    res.json({message : "Admin registered"})
})



app.post('/login', async (req,res) => {

    const {email,password} = req.body

    const admin = await Admin.findOne({email})

    if(!admin) {
        return res.status(400).json({message : "Admin not found!!!"})
    }

    const isMatch = await bycrypt.compare(password, admin.password)

    if(!isMatch) {
        return res.status(400).json({message : "Password dosen't match"})
    }

    const token = jwt.sign(
        {id: admin._id},
        process.env.JWT_SECRET,
        {expiresIn  : "1h"}
    )

    res.json({token})
})



const storage = multer.diskStorage( {
    destination : function(req,file,cb) {
        cb(null, 'uploads/')
    },

    filename : function(req,file,cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({storage})



app.post('/users', protect, upload.single('photo'), async (req,res) => {

    const {name,email,username} = req.body

    const user = new User({
        name,
        email,
        username,
        photo : req.file ? req.file.filename : null
    })

    await user.save()

    res.json(user)


})

app.get('/users', protect, async (req,res) => {

    const users = await User.find()
    res.json(users)

})

app.get('/users/:id', protect, async (req,res) => {

    const {id} = req.params.id

    const user = await UserfindById(id)
    res.json(user)
})



app.put('users/:id', protect , async (req,res) => {

    const user = await User.findById(req.params.id)

    if(!user) {
        res.status(404).json({message : "User not found"})
    }

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.username = req.body.username || user.username

    await user.save()

    res.json(user)
})




app.delete('users/:id', protect , async (req,res) => {

    const {id} = req.params.id

    await User.findByIdAndDelete(id)

    res.json({message : "User deleted"})

})



app.listen(8000)