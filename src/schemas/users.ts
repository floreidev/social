import { Schema, model } from "mongoose"

interface IUser {
    id: string,
    username: string,
    email?: string,
    password: string,
    avatar?: string,
    bio?: string,
    pronouns?: string,
    friends?: string[],
    location?: string,
    following?: string[],
    followers?: string[],
    suppressed?: boolean,
    followingTopics?: string[],
    displayName?: string
}

const UsersSchema = new Schema<IUser>({
    username: {type: String, required: true, unique: true },
    email: {type: String, required: false, unique: false },
    password: {type: String, required: true, unique: false },
    avatar: String,
    bio: String,
    pronouns: String,
    friends: Array<String>,
    location: String,
    following: Array<String>,
    followers: Array<String>,
    suppressed: Boolean,
    followingTopics: Array<String>,
    displayName: String
})

const User = model<IUser>('User', UsersSchema);

export default User; 
export type {IUser};