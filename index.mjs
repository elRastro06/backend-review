import express from "express";
import v2 from "./v2.mjs";
import cors from "cors";
import axios from "axios";
import { ObjectId } from "mongodb";
import reviews from "./conn.mjs";

const app = express();
const port = 5008;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});

const clients = process.env.CLIENTS != undefined ? process.env.CLIENTS : "localhost";

const verifyToken = async (req, res, next) => {
  try {
    if (req.method != "GET") {
      const response = await axios.get(`http://${clients}:5000/checkToken/${req.headers.authorization}`);
      const user = response.data.user;

      if ((req.method == 'PUT' || req.method == 'DELETE') && req.params.id != undefined) {
        const review = await reviews.findOne({ _id: new ObjectId(req.params.id) });
        if (review.reviewerID != user._id) {
          res.status(402).send("Unauthorized action");
          return;
        }
      } else if (req.method == 'POST' && req.body.reviewerID != user._id) {
        res.status(402).send("Unauthorized action");
        return;
      }
    }

    next();
  } catch {
    res.status(401).send({ error: "Invalid token" });
  }
}

app.use("/v2", verifyToken, v2);
