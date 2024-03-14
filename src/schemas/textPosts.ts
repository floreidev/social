import { Schema, model } from "mongoose"

interface ITextPost {
    id: string,
    author: string,
    content: string,
    likes?: string[],
    replies?: ITextPost[],
    attachments?: string[],
    replyTo?: string,
    createdAt: Date,
    updatedAt: Date
}

const TextPostsSchema = new Schema<ITextPost>({
    author: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Array<string>, default: [] },
    replies: { type: Array<ITextPost>, default: [] },
    attachments: { type: Array<string>, default: [] },
    replyTo: { type: String, default: "ROOT" },
}, {timestamps: true})

const TextPost = model<ITextPost>('TextPost', TextPostsSchema);


export default TextPost; 
export type {ITextPost}