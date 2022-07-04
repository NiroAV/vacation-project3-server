import fileUpload from "express-fileupload"
import dotenv from "dotenv";
import authController from "./06-controllers/user-controller"
dotenv.config(); 
import socketLogic from "./05-logic/socket-logic";


import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import config from "./01-utils/config";
import errorsHandler from "./02-middleware/errorsHandler";
import ErrorModel from "./03-models/ErrorModel";
import controller from "./06-controllers/vacation-controller";
import expressRateLimit from "express-rate-limit";
import sanitize from "./02-middleware/sanitize";


const server = express();
server.use("/api/", expressRateLimit({ 
    windowMs: 1000, 
    max: 10, 
	message: "Are You a Hacker?" 
}));
server.use(fileUpload());


if (config.isDevelopment) server.use(cors());
server.use(express.json());
server.use("/api", controller);
server.use("/api",authController);
server.use(sanitize);

server.use("*", (request: Request, response: Response, next: NextFunction) => {
    next(new ErrorModel(404, "Route not found."));
});

server.use(errorsHandler);

const httpServer =  server.listen(process.env.PORT, () => console.log("Listening..."));

socketLogic(httpServer);
