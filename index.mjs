//inicio

import express from "express";
import v2 from "./v2.mjs";

const app = express();
const port = 5008;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});

app.use("/v2", v2);
