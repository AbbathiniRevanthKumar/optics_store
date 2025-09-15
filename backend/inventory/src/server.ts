import app from "./app";

const port = process.env.APP_PORT || 8002;

app.listen(port, () => {
  console.log(`Inventory service is running at port : ${port}`);
});
