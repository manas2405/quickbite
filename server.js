const express = require('express');
const app = express();
const connectDB = require('./db');
const userRoutes = require('./backend/routes/userRoutes')
connectDB();

app.use(express.json())
app.use('/api/users', userRoutes)

app.listen(3001, () => {
    console.log(`Server started`);
});