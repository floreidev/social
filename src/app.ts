import express from "express";
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from "express-session"
import local from "./strategies/local";
import passport from "passport";

local(passport);


mongoose.connect("mongodb://localhost:27017/social").then((m) => {
    console.log("Connected")
}).catch((err) => {
    console.log(err)
})



const app = express();

import legalRouter from "./routes/legal"
import indexRouter from "./routes/index"
import authRouter from "./routes/auth"
import homeRouter from "./routes/home"
import feedRouter from "./routes/feed"
import apiRouter from "./routes/api";

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SECRET || "-- im going to piss and shit and fart all over the place -- this is a threat. a massive threat. fuck you.",
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/", indexRouter)
app.use("/legal", legalRouter)
app.use("/auth", authRouter)
app.use("/home", homeRouter)
app.use("/feed", feedRouter)
app.use("/api", apiRouter)

app.use((req, res, next) => {
    res.render('404')
})



module.exports = app