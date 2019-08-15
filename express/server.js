import express from "express";
import routes from "./route";

const app = express();
const defaultPort = 6128;

app.use(express.json());
app.use(express.static("dist/storyteller"));
app.use(routes);

const server = app.listen(defaultPort, "localhost", () => {
  const port = server.address().port;
  console.log("Server started");
  console.log("Open the following URL to display the user interface:");
  console.log(`http://localhost:${port}/app`);
});