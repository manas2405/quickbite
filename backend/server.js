const express = require('express');
const app = express();
const connectDB = require('./config/db');
const userRoutes = require('./routes/UserRoutes');
const foodRoutes = require('./routes/FoodRoutes');
const cartRoutes = require('./routes/CartRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const PORT = 4000;

connectDB();

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use("/images", express.static('uploads'));

app.listen(PORT, () => {
    console.log(`Server started on port : ${PORT}`);
});
