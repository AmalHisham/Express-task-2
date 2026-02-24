import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import bycrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Admin from './models/Admin.js'

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

app.listen(8000)