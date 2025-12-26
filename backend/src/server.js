import express from "express";
import dotenv from "dotenv";
import {ENV } from "./lib/env.js"
dotenv.config()
const app = express()

app.get("/health", (req , res ) => {
  res.status(200).json({msg : "api is up and running"})
})

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port: ${ENV.PORT}`)
})