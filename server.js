import express from 'express'

const app = express()

app.use(express.json())

app.get("/", (req,res) => {
    res.json({message : "man!!!, this is working"})
})

app.listen(8000)