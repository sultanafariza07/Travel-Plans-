// ================= LOAD ENV FIRST (🔥 MOST IMPORTANT) =================
require("dotenv").config();

// 🔍 DEBUG (REMOVE LATER)
console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);

// ================= IMPORTS =================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const passport = require("passport");

// Load passport config AFTER env
require("./config/passport");

const errorHandler = require("./middleware/errorHandler");

// ================= INITIALIZE APP =================
const app = express();

// ================= SECURITY =================
app.use(helmet());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { msg: "Too many requests from this IP, please try again later." },
});
app.use("/api/auth", limiter);

// ================= CORS =================
const allowedOrigins = ["http://localhost:3000"];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// ================= CORE MIDDLEWARE =================
app.use(express.json());

// ================= PASSPORT INIT =================
app.use(passport.initialize());

// ================= ROUTES =================
const authRoutes = require("./routes/auth");
const tripRoutes = require("./routes/trips");
const weatherRoutes = require("./routes/weather");
const expenseRoutes = require("./routes/expenses");
const translatorRoutes = require("./routes/translator");
const bookingRoutes = require("./routes/booking");
const destinationRoutes = require("./routes/destinations");
const packingRoutes = require("./routes/packing");

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/translator", translatorRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/packing", packingRoutes);

// ================= BASE ROUTE =================
app.get("/", (req, res) => {
  res.send("Travel Planner API is running!");
});

// ================= ERROR HANDLER =================
app.use(errorHandler);

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Could not connect to MongoDB", err));

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
