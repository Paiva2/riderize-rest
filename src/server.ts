import app from "./app";

const port = Number(process.env.PORT);

const server = app.listen(port, () => {
  console.log("Running on port: " + port ?? 8080);
});

export default server;
