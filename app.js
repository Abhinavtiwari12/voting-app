import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from './src/router/user.router.js';
import adminRouter from './src/router/admin.router.js'


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGON,
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());


app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);


export { app }