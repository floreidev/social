import express from 'express';
import { FeedType } from './feed';
import utils from '../utils';
import { IUser } from '../schemas/users';
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

router.get("/me/feed/:feed", async (req, res) => {
    const feedType = req.params.feed as FeedType;
    if (req.isUnauthenticated()) return res.status(401).json({ error: { message: "Error 401: Unauthorized", code: 401 } });
    const user: IUser = req.user as IUser;
    switch (feedType) {
        case FeedType.Text:
            return res.status(200).json(await utils.collateFeed(user.id))
        default:
            return res.status(400).json({ error: { message: "Error 400: Incorrect feed type supplied.", code: 400 } })
    }
})

export default router;