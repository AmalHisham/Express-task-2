import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import bycrypt from 'bcryptjs'
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

app.listen(8000)