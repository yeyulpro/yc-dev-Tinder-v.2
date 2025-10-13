import express from 'express';
import { userAuth } from "../middlewares/auth.js";
export const requestsRouter = express.Router();


requestsRouter.post('/sendConnectionRequest', userAuth, (req, res) => {
  
  console.log("hi");

  res.send("connection requested")
})