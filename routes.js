const express = require("express");
const router = express.Router();
const elastic = require("elasticsearch");
const bodyParse = require("body-parser").json();

const elasticClient = elastic.Client({ host: "localhost:9200" });

let products = [
  { id: "1", name: "test1", description: "test1 description" },
  { id: "2", name: "test2", description: "test2 description" },
  { id: "3", name: "test3", description: "test3 description" },
];

router.use((req, res, next) => {
  elasticClient
    .index({
      index: "logs",
      body: { url: req.url, method: req.method },
    })
    .then((res) => {
      console.log("LOGS IN");
    })
    .catch((err) => {
      console.log("EROR");
    });
  next();
});

router.post("/products", bodyParse, (req, res) => {
  elasticClient
    .index({ index: "products", body: req.body })
    .then((res) => {
      return res.status(200).json({ msg: "product indexed" });
    })
    .catch((err) => {
      return res.status(500).json({ msg: "ERROR", err });
    });
});

router.get("/products/:id", (req, res) => {
  elasticClient
    .get({ index: "products", id: req.params.id })
    .then((resp) => {
      if (!resp) {
        return res.status(404).json({ product: resp });
      }
      return res.status(200).json({ product: resp });
    })
    .catch((error) => {
      return res.status(500).json({ mesg: "DDD", error });
    });
});

router.get("/products", (req, res) => {
  elasticClient
    .get({ index: "products" })
    .then((resp) => {

      return res.status(200).json({ product: resp.hits.hits });
    })
    .catch((error) => {
      return res.status(500).json({ mesg: "DDD", error });
    });
});
module.exports = router;
