const Order = require('../models/OrderModel');
const User = require('../models/UserModel');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order from frontend
exports.placeOrder = async (req, res) => {
    const frontend_URL = "http://localhost:5173";
    
    try{
        const newOrder = new Order({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });

        await newOrder.save();
        await User.findByIdAndUpdate(req.body.userId, {cartDat : {}});

        const line_items = req.body.items.map((item) => ({
            price_data : {
                currency: "inr",
                product_data : {
                    name : item.name
                },
                unit_amount : item.price * 100 * 80
            },
            quantity : item.quantity
        }));

        line_items.push({
            price_data : {
                currency : "inr",
                product_data : {
                    name : "Delivery Charges"
                },
                unit_amount : 2 * 100 * 80
            },
            quantity : 1
        });

        const session = await stripe.checkout.sessions.create({
            line_items : line_items,
            mode : "payment",
            success_url : `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url : `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({success : true, session_url : session.url});
    }
    catch (error) {
        console.error(error);
        res.json({success : false, message : "Error"});
    }
}