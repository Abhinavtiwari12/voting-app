import mongoose, { Schema } from "mongoose";

const candidateSchema = new Schema (
    {
        fullName: {
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
        votes:[
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                votedAt:{
                    type: Date,
                    default: Date.now()
                }
            }
        ],
        voteCount: {
            type: Number,
            default: 0
        }
    }
)



export const Candidate = new mongoose.model("Candidate", candidateSchema)