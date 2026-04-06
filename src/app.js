import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.urlencoded({extended: true}));    // for nested json
app.use(cookieParser());                          // for cookies access (JWT tokens)
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));

// test server
app.route("/check-server").get((req, res) => {
    return res.send("Hi, Server is running!");
});

// import routers
import authRouter from "./routes/auth.routes.js";
import adminRouter from "./routes/admin.routes.js";
import recordRouter from "./routes/record.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

// register routes
// 1. auth. routes
app.use("/api/v1/auth", authRouter);
// 2. admin routes
app.use("/api/v1/admins", adminRouter);
// 3. record routes
app.use("/api/v1/records", recordRouter);
// 4. dashboard routes
app.use("/api/v1/dashboard", dashboardRouter);


export default app;