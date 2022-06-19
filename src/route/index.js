import express from "express";
const router = express.Router();

// importing routes
import healthzRoute from "./healthz.js"

// health route
router.use("/healthz", healthzRoute);
router.get("/", (req, res) => {
    res.render("default", {
        ...req.systemInformation,
        json: JSON.stringify(req.systemInformation, null, 3)
    })
})

export default router;
