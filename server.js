import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

const app = express()

app.use(express.json())

dotenv.config()

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err))


app.get("/", (req,res) => {
    res.json({message : "mahn!!!, this is working"})
})

app.listen(8000)