const express = require("express");
const app = express();
var cors = require('cors');

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const paymentRoute = require("./routes/stripe");




dotenv.config()

mongoose.connect(
    process.env.MONGO_DB)
    .then(() => console.log("DB connection Successfull"))
    .catch((err) => console.log("connection to db failed : " + err));


  
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Backend server is runing : " + port)
});

app.use(cors())
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use('/api/payments', paymentRoute);

