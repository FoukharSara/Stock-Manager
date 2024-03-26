const express = require("express");
const router = express.Router();
const db = require("../models");
const authenticateToken = require("../routes/loggedin");

router.get("/producttype", authenticateToken, (req, res) => {
  db.ProductType.findAll()
    .then((response) => res.render("producttype", { products: response }))
    .catch((err) => res.status(400).send(err));
});

//add
router.get("/add_prodtype", authenticateToken, (req, res) => {
  res.render("add_prodtype", { message: "" });
});

router.post("/add_prodtype", authenticateToken, (req, res) => {
  if (!req.body.label) {
    return res.render("add_prodtype", {
      message: "Veuillez remplir les infos",
    });
  }
  db.ProductType.create({
    label: req.body.label,
  })
    .then((response) =>
      res.render("add_prodtype", { message: "Element Ajouté" })
    )
    .catch((err) => res.status(400).send(err));
});

//edit
router.post("/producttype/:id", authenticateToken, async (req, res) => {
  await db.ProductType.update(
    {
      label: req.body.label,
    },
    {
      where: { id: req.params.id },
    }
  )
    .then((data) => {
      res.redirect("/edit_producttype/" + req.params.id);
    })
    .catch((err) => res.status(400).send(err));
});

router.get("/edit_producttype/:id", authenticateToken, (req, res) => {
  db.ProductType.findOne({ where: { id: req.params.id } })
    .then((response) => res.render("edit_producttype", { product: response }))
    .catch((err) => res.status(400).send(err));
});

//delete

router.get("/producttype/delete/:id", async (req, res) => {
  try {
    const productTypeId = req.params.id;

    // Find the ProductType
    const productType = await db.ProductType.findByPk(productTypeId);

    if (!productType) {
      return res.status(404).send("ProductType not found");
    }

    // Find associated Products and delete them
    const associatedProducts = await productType.getProducts();
    for (const product of associatedProducts) {
      await product.destroy();
    }

    // Delete the ProductType
    await productType.destroy();

    res.redirect("/producttype"); // Redirect back to the product form or appropriate page
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting ProductType");
  }
});


module.exports = router;
