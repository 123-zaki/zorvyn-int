import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./db.connect.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const startServer = async() => {
    try {
        await connectDB();

        // now start the server after DB successfull connection
        app.listen(PORT, () => {
            console.log(`App is listening on port: ${PORT}`);
        });
    } catch (error) {
        console.log(`Something went wrong while starting server: ${error}`);
    }
};

startServer();