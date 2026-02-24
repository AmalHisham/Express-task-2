import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    username : String,
    photo : String
})

export default mongoose.model("User", userSchema)