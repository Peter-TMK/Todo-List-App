const express = require("express");
const config = require("./utils/config");
// The 'magic' of the "express-async-errors" library
// allows us to eliminate the try-catch blocks completely.
// For example the route for deleting a note.
// Ensure to import it before the routes are imported
// require("express-async-errors");
const app = express();
const cors = require("cors");
const signupRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
// const notesRouter = require("./controllers/notes");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

// mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());

app.use("/api/signup", signupRouter);
app.use("/api/login", loginRouter);
// app.use("/api/notes", notesRouter);

module.exports = app;
