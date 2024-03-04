import app from "./app";

const port = Number(process.env.PORT);

const server = app.listen(port ?? 8000, () => {
  console.log("Running on port: " + port ?? 8000);
});

export default server;
