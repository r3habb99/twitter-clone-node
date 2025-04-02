const express = require("express");
const app = express();

// const mongoose = require("mongoose");
const middleware = require("./src/middlewares/authMiddleware");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const socketIo = require("socket.io");
const http = require("http"); // Import the HTTP module
require("dotenv").config();

const indexRoutes = require("./src/routes/index");
const indexApiRoutes = require("./src/routes/api/index");
const { logger } = require("./src/utils/logger");
const { connectDB } = require("./src/db/database");
const port = process.env.PORT || 3000;
// Create an HTTP server
const httpServer = http.createServer(app);

// Attach socket.io to the HTTP server
const io = socketIo(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000", // Development URL
      "https://social-message-post.onrender.com", // Production URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type"],
    credentials: true, // Allows cookies/session data
  },
  pingTimeout: 60000,
});

const startServer = () => {
  try {
    connectDB();
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host =
      process.env.NODE_ENV === "production"
        ? "social-message-post.onrender.com"
        : "192.168.0.88";

    httpServer.listen(port, () => {
      logger.info(`Server is up and running at ${protocol}://${host}:${port}/`);
    });
  } catch (error) {
    logger.error("❌ Error starting server: ", error);
    process.exit(1);
  }
};

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "src/uploads/images"))
);
app.use(
  "/uploads/cover",
  express.static(path.join(__dirname, "src/uploads/cover"))
);
app.use(
  session({
    secret: "bbq chips",
    resave: true,
    saveUninitialized: false,
  })
);

app.use("/", indexRoutes);
app.use(indexApiRoutes);

app.get("/", middleware.requireLogin, (req, res, next) => {
  let payload = {
    pageTitle: "Home",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };

  res.status(200).render("home", payload);
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    logger.info("Socket connected to room", userData._id);
    socket.emit("connected");
  });

  socket.on("join room", (room) => {
    socket.join(room);
    logger.info("Socket joined room", room);
  });
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
    logger.info("User is typing in room", room);
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
    logger.info("User stopped typing in room", room);
  });

  socket.on("notification received", (room) => {
    socket.in(room).emit("notification received");
    logger.info("Notification received in room", room);
  });

  socket.on("new message", (newMessage) => {
    let chat = newMessage.chat;

    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) return;
      socket.in(user._id).emit("message received", newMessage);
      logger.info("Message received in room", user._id);
    });
  });
});

// Start the server
startServer();
