import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const candidateSchema = new Schema (
    {
        fullname: {
            type: String,
            required: true
        },
        party: {
            type: String,
            required: true
        },
        age: {
            type: String,
            required: true,
        },
        candidateId :{
            type: String,
            require: true,
            unique: true
        },
        addharNumber: {
            type: String,
            required: true,
            unique: true,
            minlength: [ 12, 'Color must be at least 12 characters long' ],
        },
        votes:[
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                votedAt:{
                    type: Date,
                    default: Date.now
                }
            }
        ],
        voteCount: {
            type: Number,
            default: 0
        },
        refreshToken:{
            type: String
        }
    },{timestamps: true}
)


candidateSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)
})

candidateSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

candidateSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

candidateSchema.methods.generateRefreshToken = function() {
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


export const Candidate = new mongoose.model("Candidate", candidateSchema)