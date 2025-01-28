import express from "express";
import cors from "cors"
import dbConnect from "./config/db.connection.js";
import authRoutes from "./routes/user.route.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import helmet from "helmet";

const app = express();

// Database connection
dbConnect();

// Middlewares
app.use(cors())
app.use(helmet());
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Routes
app.use('/api/v1',authRoutes)

// Middleware for route handlers
app.use(errorMiddleware)

// App running on this 
const PORT=process.env.PORT
const HOST=process.env.HOST
app.listen(PORT || 5000,()=>{
    console.log(`app running on http://${HOST}:${PORT}`);
    
})