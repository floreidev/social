import express from 'express';
import utils from '../utils';

const router = express.Router();

router.get("/", (req, res) => {
    var message = false;
    //@ts-ignore
    if(req.query.msg) message = utils.getMessage(parseInt(req.query.msg)) || false;
    res.render("index", {message})
})

export default router;