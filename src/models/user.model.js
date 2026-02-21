import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema( 
    {
        fullname:{
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
            minlength: [ 10, 'Color must be at least 10 characters long' ],
        },
        addharNumber: {
            type: String,
            required: true,
            unique: true,
            minlength: [ 12, 'Color must be at least 12 characters long' ],
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
        },
        votedCandidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candidate"
        },
        refreshToken:{
            type: String
        }
    },{timestamps: true}
)

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = new mongoose.model("User", userSchema)