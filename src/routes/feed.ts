import express from 'express';
import utils from '../utils';
import TextPost from '../schemas/textPosts';
import { IUser } from '../schemas/users';

const router = express.Router();
enum FeedType {
    Text = "text",
    Image = "image",
    Video = "video",
    Swipe = "swipe",
    Group = "group",
    Messag = "message"
}


router.get("/:type", async (req, res) => {
    var feedType: FeedType = req.params.type as FeedType;
    res.render("home", {type: feedType})
})

export default router;
export {FeedType}