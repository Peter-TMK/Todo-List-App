const jwt = require("jsonwebtoken");

const noteRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");
// const morgan = require("morgan");

// morgan.token("req-body", (req) => JSON.stringify(req.body));

// app.use(
//   morgan(
//     ":method :url :status :res[content-length] - :response-time ms :req-body"
//   )
// );

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

// noteRouter.get("/", (request, response) => {
//   Note.find({}).then((notes) => {
//     response.json(notes);
//   });
// });

noteRouter.get("/", async (request, response) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
  response.json(notes);
});

noteRouter.get("/:id", async (request, response, next) => {
  // Note.findById(request.params.id)
  //   .then((note) => {
  //     if (note) {
  //       response.json(note);
  //     } else {
  //       response.status(404).end();
  //     }
  //   })

  //   .catch((error) => next(error));
  // try {
  //   const note = await Note.findById(request.params.id);
  //   if (note) {
  //     response.json(note);
  //   } else {
  //     response.status(404).end();
  //   }
  // } catch (exception) {
  //   next(exception);
  // }
  const note = await Note.findById(request.params.id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "invalid token",
    });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }
  next(error);
};

noteRouter.delete("/:id", async (request, response, next) => {
  // Note.findByIdAndDelete(request.params.id)
  //   .then((result) => {
  //     response.status(204).end();
  //   })
  //   .catch((error) => next(error));
  // try {
  //   await Note.findByIdAndDelete(request.params.id);
  //   response.status(204).end();
  // } catch (exception) {
  //   next(exception);
  // }
  await Note.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

noteRouter.put("/:id", async (request, response, next) => {
  // const { content, important } = request.body;

  // Note.findByIdAndUpdate(
  //   request.params.id,

  //   { content, important },
  //   { new: true, runValidators: true, context: "query" }
  // )
  //   .then((updatedNote) => {
  //     response.json(updatedNote);
  //   })
  //   .catch((error) => next(error));

  try {
    const { content, important } = request.body;

    const updatedNote = await Note.findByIdAndUpdate(
      request.params.id,

      { content, important },
      { new: true, runValidators: true, context: "query" }
    );
    response.status(201).json(updatedNote);
  } catch (exception) {
    next(exception);
  }
});

noteRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);

  // const user = await User.findById(body.userId);

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user._id,
  });

  // note
  //   .save()
  //   .then((savedNote) => {
  //     response.status(201).json(savedNote);
  //   })

  //   .catch((error) => next(error));

  // const savedNote = await note.save();
  // response.status(201).json(savedNote);

  // try {
  //   const savedNote = await note.save();
  //   response.status(201).json(savedNote);
  // } catch (exception) {
  //   next(exception);
  // }
  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();
  response.json(savedNote);
  // response.status(201).json(savedNote);
});

noteRouter.use(errorHandler);
module.exports = noteRouter;
