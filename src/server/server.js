/* eslint-disable no-console */
import express from "express";

import openURL from "open";

import routes from "./route/index.js";

import {setRef} from "./util/close.js";

const showHelp = () => {
  console.log(
    `
Usage:

  npm start [--port <port>] [--no-open]
`.trim(),
  );
};

const main = ({help, noOpen, port}) => {
  if (help) {
    showHelp();
    return;
  }
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
    const activePort = server.address().port;
    const url = `http://localhost:${activePort}/app`;
    console.log("Server started");
    if (noOpen) {
      console.log("You can open the interface by following this URL:");
    } else {
      console.log("A browser should have been opened to display the user interface.");
      console.log(
        "If that's not the case, or you want to open a new window, use the following URL:",
      );
      openURL(url);
    }
    console.log("");
    console.log(`    ${url}`);
    setRef(server);
  });
};

const eatCli = (index, isBoolean) => {
  if (isBoolean) {
    process.argv.splice(index, 1);
    return true;
  }
  // eslint-disable-next-line no-magic-numbers
  const [, result] = process.argv.splice(index, 2);
  return result;
};

const consumeCli = (short, long, isBoolean) => {
  const shortIndex = process.argv.indexOf(short);
  if (shortIndex !== -1) return eatCli(shortIndex, isBoolean);
  const longIndex = process.argv.indexOf(long);
  if (longIndex !== -1) return eatCli(longIndex, isBoolean);
  return isBoolean ? false : undefined;
};

/** Parse command line arguments and pass them to the application. */
const parseCLI = () => {
  const port = consumeCli("-p", "--port", false);
  const noOpen = consumeCli("-n", "--no-open", true);
  const help = consumeCli("-h", "--help");
  return {help, noOpen, port};
};

main(parseCLI());
