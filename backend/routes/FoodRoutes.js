const express = require('express');
const { addFood, listFood, removeFood } = require("../controllers/FoodController");
const multer = require("multer");
const router = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
    destination : "uploads",
    filename : (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({storage : storage});

router.post("/add", upload.single("image"), addFood);
router.get("/list", listFood);
router.post("/remove", removeFood);

module.exports = router;