import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import cors from "cors";
import express from "express";
import { createServer } from "./kibela.js";

const app = express();
app.use(cors());

const { server } = createServer();
let transport: SSEServerTransport;

app.get("/sse", async (req, res) => {
  console.log("Received connection");
  transport = new SSEServerTransport("/message", res);
  await server.connect(transport);

  server.onclose = async () => {
    await server.close();
    process.exit(0);
  };
});

app.post("/message", async (req, res) => {
  console.log("Received message");
  await transport.handlePostMessage(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
