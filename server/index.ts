import express from "express";
import cors from "cors";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./schema.js";

// Create Express app
const app = express();

// Enable CORS
app.use(cors());

// GraphQL endpoint
app.all(
  "/graphql",
  createHandler({
    schema,
  }),
);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`GraphQL server running at http://localhost:${PORT}/graphql`);
});
