const foodModel = require("../models/FoodModel");
const fs = require('fs');

exports.addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category : req.body.category,
        image: image_filename
    });

    try{
        await food.save();
        res.json({success : true, message : "Food item added successfully."});
    }
    catch(error){
        console.log(error);
        res.json({success : false, message : "Error"});
    }
}

exports.listFood = async (req, res) => {
    try{
        const foods = await foodModel.find({});
        res.json({success : true, data : foods});
    }
    catch (error) {
        console.log(error);
        res.json({success : false, message : "Error"});
    }
}

exports.removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found." });
        }

        fs.unlink(`uploads/${food.image}`, (err) => {
            if (err) {
                console.log('Failed to delete image:', err);
            }
        });

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food item deleted successfully." }); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error deleting food item." }); 
    }
};
