import mongoose from "mongoose";
import TextPost, { ITextPost } from "./schemas/textPosts";
import User, { IUser } from "./schemas/users";

var messageMap: { [key: string]: string | null } = {}

// const WEIGHTS = { // These should all be functions tbh, even if for now they only return constants.
//     FOLLOWING: () => 100,
//     LIKES: (likes: number) => likes / 500,
//     MUTUAL: () => 250,
//     FOLLOWED_TOPIC: () => 25,
//     TRENDING_TOPIC: () => 25,
//     BLOCKED: () => Number.MIN_SAFE_INTEGER,
//     SUPPRESSED: () => -125,
//     SUGGESTED: () => 50,
//     TIME: (date: number) => -((Date.now() - date) / 1000 / 60 / 60)
// }


async function getWeights(postToWeight: ITextPost, browser: IUser) {
}

function getTags(content: string) {
    const tagRegex = /#[^ !@#$%^&*(),.?":{}|<>]{1,32}/g;
    return Array.from(content.matchAll(tagRegex));
}

export default {
    putMessage: (id: number, msg: string) => {
        messageMap[id.toString()] = msg;
    },

    getMessage: (id: number): string | null => {
        var msg = messageMap[id.toString()];
        messageMap[id.toString()] = null;
        return msg;
    },
    collateFeed: async (browserId: string, after: string = "") => {
        const user = await User.findById(new mongoose.Types.ObjectId(browserId)).then((u) => u);
        if(!user) return -1;
        const followingIds = user.following?.concat(user.id);
        console.log(followingIds);
        return await TextPost.find({author: {$in: followingIds}, createdAt: {$gte: Date.now() - 86400000}}, null, {sort: {createdAt: -1}, limit: 50}).exec().then((feed) => feed)
    },
    getTags,
    getWeights

}