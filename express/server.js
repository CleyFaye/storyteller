import express from "express";
import routes from "./route";
import openURL from "open";
import program from "commander";
import pkg from "../package.json";
import {setRef} from "./util/close";

const main = ({port, open}) => {
  const app = express();

  app.use(express.json());
  app.use(express.static("dist/storyteller"));
  app.use(routes);

  const server = app.listen(port, "localhost", () => {
    const port = server.address().port;
    const url = `http://localhost:${port}/app`;
    console.log("Server started");
    if (open) {
      console.log("A browser should have been opened to display the user interface.");
      console.log("If that's not the case, or you want to open a new window, use the following URL:");
      openURL(url);
    } else {
      console.log("You can open the interface by following this URL:");
    }
    console.log("");
    console.log(`    ${url}`);
    setRef(server);
  });
};

/** Parse command line arguments and pass them to the application. */
const parseCLI = () => {
  program.name("start");
  program.version(pkg.version);
  program.description(pkg.description);
  program.option("-p, --port <port>", "Select listening port", 0);
  program.option("-n, --no-open", "Don't try to open a browser window");
  program.parse(process.argv);
  return program;
};

main(parseCLI());