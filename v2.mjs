import { ObjectId } from "mongodb";
import reviews from "./conn.mjs";
import express from "express";
import { reviewBetweenUsers } from "./api.mjs";

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    let filtro = {};
    let orden = {};
    let offset = 0;
    let limit = 0;
    const queries = req.query;

    //console.log(`hola`);

    if (queries.reviewerID) {
        filtro = { ...filtro, reviewerID: queries.reviewerID };
    }
    if(queries.reviewedID) {
        filtro = { ...filtro, reviewedID: queries.reviewedID };
    }

    if(queries.orderBy && queries.order) {
        if (queries.order == "asc") {
            orden = { ...orden, [queries.orderBy]: 1 };
        } else if (queries.order == "desc") {
            orden = { ...orden, [queries.orderBy]: -1 };
        }
    }

    if(queries.offset) {
        offset = parseInt(queries.offset);
    }
    if(queries.limit) {
        limit = parseInt(queries.limit);
    }

    let results = await reviews.find(filtro).sort(orden).skip(offset).limit(limit).toArray();
    res.send(results).status(200);
  } catch (e) {
    res.send(e).status(500);
  }
});

app.post("/", async (req, res) => {
  try {
    const product = req.body;

    

    let result, status;
    if(req.body.rating < 1 || req.body.rating > 5) {
      result = { information: "Review not inserted, invalid rating"};
      status = 400;
    } else {
      const review = await reviewBetweenUsers(req.body.reviewerID, req.body.reviewedID);
      if(review.body.name) {  //debe haber un producto que se haya vendido entre ellos (hacer que funcione)
        
        result = { information: "Review not inserted, no product exchanged between the two"};
        status = 400;
      } else {
        result = await reviews.insertOne({ ...reviews, date: new Date() });
        res.send(result).status(200);
      }
    }
  } catch (e) {
    res.send(e).status(500);
  }
});

app.get("/:id", async (req, res) => {
  try {
    const result = await reviews.findOne({ _id: new ObjectId(req.params.id) });
    res.send(result).status(200);
  } catch (e) {
    res.send(e).status(500);
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const result = await reviews.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.send(result).status(200);
  } catch (e) {
    res.send(e).status(500);
  }
});

app.put("/:id", async (req, res) => {
  try {
    const result = await reviews.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.send(result).status(200);
  } catch (e) {
    res.send(e).status(500);
  }
});

export default app;
