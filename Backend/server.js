const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const schema = require("./schema");

dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:3000",  // ✅ Allow frontend requests
    credentials: true
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// GraphQL Middleware
app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

// Set PORT & Handle Address in Use Error
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
    .on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error(`❌ Port ${PORT} is already in use. Try another port.`);
            process.exit(1);
        }
    });
