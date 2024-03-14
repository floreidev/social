import express from 'express';

const router = express.Router();

router.get("/privacy", (req, res) => {
    if(req.query.plaintext) res.redirect("/legal/privacy.txt")
    else res.render("legal/privacy");
})

router.get("/tos", (req, res) => {
    if(req.query.plaintext) res.redirect("/legal/tos.txt")
    else res.render("legal/tos");
})

router.get("/credits", (req, res) => {
    if(req.query.plaintext) res.redirect("/legal/credits.txt")
    else res.render("legal/credits");
})

router.get("/contact", (req, res) => {
    if(req.query.plaintext) res.redirect("/legal/contact.txt")
    else res.render("legal/contact");
})

export default router;