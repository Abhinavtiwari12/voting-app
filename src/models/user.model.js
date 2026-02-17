import mongoose, { Schema } from "mongoose";


const userSchema = new Schema( 
    {
        fullNmae:{
            type: String,
            required: true,
            index: true
        },
        age:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            unique: true,
        },
        address: {
            type: String,
            required: true,
        },
        phoneNumber:{
            type: String,
        },
        addharNumber: {
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true
        },
        roal:{
            type: String,
            enum: ['voter', 'admin'],
            default: 'voter'
        },
        isVoted: {
            type: Boolean,
            default: false
        }
    }
)


export const User = new mongoose.model("User", userSchema)