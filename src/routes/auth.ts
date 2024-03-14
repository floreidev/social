import express from 'express';
import passport from 'passport';
import User from '../schemas/users';
import bcrypt from "bcrypt";
import utils from '../utils';
import { RateLimiterMemory } from "rate-limiter-flexible";

const router = express.Router();
const rateLimiter = new RateLimiterMemory({points: 12, duration: 1})

const parseIp = (req: any) =>
    req.headers['x-forwarded-for']?.split(',').shift()
    || req.socket?.remoteAddress;

router.use((req, res, next) => {
    const ip = parseIp(req);
    rateLimiter.consume(ip).then(() => next()).catch((err) => {
        res.status(429).json({error: {message: "Error 429: Rate limited", code: 429}})
    })
})


router.post("/local", passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/'
}))

router.post("/register/:strategy", async (req, res) => {
    switch(req.params.strategy) {
        case "local":
            const username = req.body.username.toLowerCase(), unhashedPwd = req.body.password;
            var id = Date.now()
            if(!username || !unhashedPwd) {
                utils.putMessage(id, "Username and password must be provided");
                return res.redirect(`/?msg=${id}`)
            }
            if(username.length > 30 || unhashedPwd.length < 6 || username.length <= 0) {
                utils.putMessage(id, "Username must be at most 30 characters. Password must be at least 6 characters.");
                return res.redirect(`/?msg=${id}`)
            }
            if(!(/^[a-zA-Z0-9_.]{1,30}$/g).test(username)) {
                utils.putMessage(id, "Username must only include a-z, 0-9, _ and .");
                return res.redirect(`/?msg=${id}`)
            }
            const exists = await User.exists({username})
            if(exists) {
                var id = Date.now()
                utils.putMessage(id, "Username already exists.");
                return res.redirect(`/?msg=${id}`)
            }
            const pwd = await bcrypt.hash(unhashedPwd, parseInt(process.env.SALT_ROUNDS || "10"))
            const user = await User.create({
                username: username,
                password: pwd
            })
            req.login({id: user._id}, (err) => {
                if(err) console.log(err);
                else res.redirect('/home')
            })
            break;
    }
})

export default router;