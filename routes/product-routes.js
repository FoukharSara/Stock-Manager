const express = require("express");
const router = express.Router();
const db = require("../models");
const authenticateToken = require("../routes/loggedin");

//add Product
router.get("/add_product", async (req, res) => {
  db.ProductType.findAll()
    .then((prodtype) =>
      res.render("add_product", { message: "", prodtype: prodtype })
    )
    .catch((err) => console.log(err));
});

router.post("/createproduct", authenticateToken, async (req, res) => {
  try {
    const prodtype = await db.ProductType.findAll();
    if (
      !req.body.désignation ||
      !req.body.label ||
      !req.body.constructeur ||
      !req.body.disponibilité
    ) {
      return res.render("add_product", {
        prodtype: prodtype,
        message: "Veuillez remplir les infos",
      });
    }
    const productType = await db.ProductType.findOne({
      where: { label: req.body.label },
    });

    if (!productType) {
      return res.status(404).send("ProductType not found");
    }
    const product = await db.Product.create({
      désignation: req.body.désignation,
      type: req.body.label,
      constructeur: req.body.constructeur,
      disponibilité: req.body.disponibilité,
    });

    // Associate the Product with the ProductType
    await product.setProductType(productType);

    res.render("add_product", {
      prodtype: prodtype,
      message: "Produit Ajouté",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});


//find it
router.get("/products", authenticateToken, (req, res) => {
  db.Product.findAll()
    .then((response) => res.render("products", { products: response }))
    .catch((err) => res.status(400).send(err));
});

//edit Client
router.post("/product/:id", authenticateToken, async (req, res) => {
  await db.Product.update(
    {
      désignation: req.body.désignation,
      type: req.body.label,
      constructeur: req.body.constructeur,
      disponibilité: req.body.disponibilité,
    },
    {
      where: { id: req.params.id },
    }
  )
    .then((product) => {
      db.ProductType.findAll()
        .then((prodtype) =>
          res.render("edit_product", {
            product: product,
            prodtype: prodtype,
            message: "Produit mis à jour",
          })
        )
        .catch((err) => res.status(400).send(err));
    })
    .catch((err) => res.status(400).send(err));
});

router.get("/product/:id", authenticateToken, (req, res) => {
  db.Product.findOne({ where: { id: req.params.id } })
    .then((product) => {
      db.ProductType.findAll()
        .then((prodtype) =>
          res.render("edit_product", {
            product: product,
            prodtype: prodtype,
            message: "",
          })
        )
        .catch((err) => res.status(400).send(err));
    })
    .catch((err) => res.status(400).send(err));
});

//Delete Client
router.get("/product/delete/:id", authenticateToken, (req, res) => {
  db.Product.destroy({ where: { id: req.params.id } })
    .then(res.redirect("/products"))
    .catch((err) => res.status(400).send(err));
});

module.exports = router;
