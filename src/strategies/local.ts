import { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import User from "../schemas/users";
import bcrypt from "bcrypt"
import mongoose from "mongoose";



export default (passport: PassportStatic) => {
    passport.use(new LocalStrategy((username, password, cb) => {
        User.findOne({ username: username }).then((user) => {
            if (!user || !user.password || !user.username) return cb(null, false, { message: "Incorrect username or password." });
            bcrypt.compare(password, user.password, (err, same) => {
                if (err) return cb(err);
                if (!same) return cb(null, false, { message: "Incorrect username or password." })
                return cb(null, user);
            })
        }).catch((err) => cb(err, false));
    }))

    passport.serializeUser((user, cb) => {
        process.nextTick(() => {
            ///@ts-ignore
            cb(null, { id: user.id })
        })
    })

    passport.deserializeUser((id, cb) => {
        //@ts-ignore
        User.findById(new mongoose.Types.ObjectId(id)).then((v) => {
            cb(null, v);
        }).catch((err) => cb(err, false));
    })
}