import express from "express";
import { handler as GetAllHandler } from "../handlers/tickets/GetAll";
import { handler as PostHandler } from "../handlers/tickets/Post";
import { handler as DeleteHandler } from "../handlers/tickets/Delete";
import { ConvertRequestToLambda } from "../middleware/ConvertRequestToLambda";

const router = express.Router();

router.get("/", ConvertRequestToLambda, async (req, res, next) => {
  try {
    res.send(await GetAllHandler(req.event));
  } catch (e) {
    next();
  }
});

router.post("/", ConvertRequestToLambda, async (req, res, next) => {
  try {
    res.send(await PostHandler(req.event));
  } catch (e) {
    next();
  }
});

router.delete("/{id}", ConvertRequestToLambda, async (req, res, next) => {
  try {
    res.send(await DeleteHandler(req.event));
  } catch (e) {
    next();
  }
});

export default router;
