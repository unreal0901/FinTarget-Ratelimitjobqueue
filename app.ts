import config from "./config/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/index"; 


const app = express();
const allowedOrigins = config.allowedOrigins;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
routes(app);

export default app;
