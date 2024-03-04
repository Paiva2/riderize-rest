import app from "./app";

const port = 8081;

const server = app.listen(port, () => {
  console.log("Running on port: " + port);
});

export default server;
