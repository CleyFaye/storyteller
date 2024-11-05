import express from "express";
import routes from "./route";
import openURL from "open";
import program from "commander";
import pkg from "../package.json";
import {setRef} from "./util/close";
import winston from "winston";
import expressWinston from "express-winston";

const main = ({port, open}) => {
  const app = express();

  app.use(express.json());

  /*
  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.splat(),
      winston.format.simple(),
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}} {{req.body}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  }));
  */

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