import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { routes } from "./src/routes";
import { APIGatewayProxyEvent } from "aws-lambda";

declare global {
  namespace Express {
    interface Request {
      event: APIGatewayProxyEvent;
    }
  }
}

dotenv.config({ path: "../.env" });

const app: express.Application = express();
const port = process.env.SERVER_PORT;

app.use(
  cors({
    origin: [process.env.FRONTEND_URL as string],
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    allowedHeaders: ["*"],
  }),
);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

routes(app);

app.use(async (req, res) => {
  res.status(500).json({
    status: "error",
    message: "internal server error",
    path: req.path,
  });
});

const main = () => {
  app.listen(port, () => {
    console.log("Server listening on port", port);
  });
};

main();
