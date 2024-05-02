import { Application } from "express";
import Bases from "./routes/bases";
import Tickets from "./routes/tickets";
import Planes from "./routes/planes";
import Flights from "./routes/flights";

export const routes = (app: Application): void => {
  app.use("/bases", Bases);
  app.use("/tickets", Tickets);
  app.use("/planes", Planes);
  app.use("/flights", Flights);
};
