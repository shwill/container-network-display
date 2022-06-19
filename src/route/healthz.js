import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    console.log(req.system)
    res.status(200).json(1)
})

export default router;