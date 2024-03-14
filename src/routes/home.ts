import express from 'express';

const router = express.Router();

router.get("/", (req, res) => {
    if(req.isUnauthenticated()) return res.redirect('/')
    res.redirect("/feed/text");
})

export default router;