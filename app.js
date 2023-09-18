const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const databaseConnection = require("./config/database");
const HTTP_STATUS = require("./constants/statusCodes");

const ProductRouter = require("./routes/Product");
const AuthRouter = require("./routes/Auth");
const CartRouter = require("./routes/Cart");
const ReviewRouter = require("./routes/Review");
const UserRouter = require("./routes/User");
const AdminRouter = require("./routes/Admin");

dotenv.config();

app.use(cors({origin: "*"}));
app.use(express.json()); // Parses data as JSON
app.use(express.text()); // Parses data as text
app.use(express.urlencoded({ extended: true })); // Parses data as urlencoded

app.use("/api/products", ProductRouter);
app.use("/api/auth",AuthRouter);
app.use("/api/review",ReviewRouter);
app.use("/api/cart",CartRouter);
app.use("/api/user",UserRouter);
app.use("/api/admin",AdminRouter);

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON' });
    }
    next();
});

databaseConnection(()=>{
  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
})
