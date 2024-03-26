const express = require("express");
const router = express.Router();
const db = require("../models");
const authenticateToken = require("../routes/loggedin");

//add Client
router.get("/add_client", authenticateToken, (req, res) => {
  res.render("add_client", { message: "" });
});

router.post("/createclient", authenticateToken, (req, res) => {
  const authenticatedUser = req.user;
  if (!req.body.email || !req.body.phone || !req.body.companyname) {
    return res.render("add_client", { message: "Veuillez remplir les infos" });
  }
  db.Client.count({ where: { email: req.body.email } }).then((doc) => {
    if (doc != 0) {
      res
        .status(400)
        .render("add_client", { message: "Adresse e-Mail  utilisée" });
    } else {
      db.Client.create({
        companyname: req.body.companyname,
        email: req.body.email,
        phone: req.body.phone,
        addedby: authenticatedUser.username, // Set the 'addedby' field with the username
      })
        .then((response) =>
          res.render("add_client", { message: "Client Ajouté" })
        )
        .catch((err) => res.status(400).send(err));
    }
  });
});

//find it
router.get("/welcome", authenticateToken, (req, res) => {
  db.Client.findAll()
    .then((response) => res.render("welcome", { clients: response }))
    .catch((err) => res.status(400).send(err));
});

//edit Client
router.post("/client/:id", authenticateToken, async (req, res) => {
  await db.Client.update(
    {
      companyname: req.body.companyname,
      email: req.body.email,
      phone: req.body.phone,
      addedby: "user1",
    },
    {
      where: { id: req.params.id },
    }
  )
    .then((data) => {
      res.redirect("/client/" + req.params.id); // Redirect to the correct client after the update
    })
    .catch((err) => res.status(400).send(err));
});

router.get("/client/:id", authenticateToken, (req, res) => {
  db.Client.findOne({ where: { id: req.params.id } })
    .then((response) => res.render("edit_client", { clients: response }))
    .catch((err) => res.status(400).send(err));
});

//Delete Client
router.get("/delete/:id", authenticateToken, (req, res) => {
  db.Client.destroy({ where: { id: req.params.id } })
    .then(res.redirect("/welcome"))
    .catch((err) => res.status(400).send(err));
});


//view client details
router.get("/view/:id", authenticateToken, async (req, res) => {
  try {
    const client = await db.Client.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: db.Product,
          attributes: ["id", "désignation"],
          through: { attributes: ["nombre"] },
        },
      ],
    });

    if (!client) {
      return res.status(404).send("Client not found");
    }
    const products = await client.getProducts()
    res.render("view", {
      title: client.companyname,
      clpr: client,
      products: products,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});




//add products to clients
router.get("/client_product/:id",authenticateToken ,async (req, res) => {
  try {
    const client = await db.Client.findOne({ where: { id: req.params.id } });
    const produit = await db.Product.findAll();
    res.render("client_product", { client:client,produit: produit }); // Pass prodtype as an array of objects
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/createproductuser/:id", authenticateToken, async (req, res) => {
  try {
    const authenticatedUser = req.user;
    const client = await db.Client.findOne({
      where: { id: req.params.id },
    });
    if (!client) {
      return res.status(404).send("Client not found");
    }

    const product = await db.Product.findOne({
      where: { désignation: req.body.produit },
    });

    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Add the association without checking
    await client.addProduct(product, {
      through: { nombre: req.body.nombre },
    });

    res.redirect("/client_product/" + client.id); // Redirect back to the client's product page
  } catch (err) {
    res.status(400).send(err.message);
  }
});






//delete clientproduct
router.get("/delete_clientproduct/:productId",authenticateToken,async (req, res) => {
    try {
      const authenticatedUser = req.user;

      const client = await db.Client.findOne({
        where: { addedby: authenticatedUser.username },
      });

      if (!client) {
        return res.status(404).send("Client not found");
      }

      const product = await db.Product.findByPk(req.params.productId);
      if (!product) {
        return res.status(404).send("Product not found");
      }

      // Disassociate the product from the client
      await client.removeProduct(product);

      res.redirect("/view/" + client.id); // Redirect back to the client's view page
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);

module.exports = router;
