import express from "express";
import routes from "./route";
import open from "open";
import {setRef} from "./util/close";

const app = express();
const defaultPort = 6128;

app.use(express.json());
app.use(express.static("dist/storyteller"));
app.use(routes);

const server = app.listen(defaultPort, "localhost", () => {
  const port = server.address().port;
  const url = `http://localhost:${port}/app`;
  console.log("Server started");
  console.log("A browser should have been opened to display the user interface.");
  console.log("If that's not the case, or you want to open a new window, use the following URL:");
  console.log("");
  console.log(`    ${url}`);
  open(url);
  setRef(server);
});