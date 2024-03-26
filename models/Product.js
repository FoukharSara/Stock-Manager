module.exports = (sequelize, Datatype) => {
  const Product = sequelize.define("Product", {
    désignation: {
      type: Datatype.STRING,
      allowNull: false,
    },
    type: {
      type: Datatype.STRING,
      allowNull: false,
    },
    constructeur: {
      type: Datatype.STRING,
      allowNull: false,
    },
    disponibilité: {
      type: Datatype.STRING,
      allowNull: false,
    },
  });

  Product.associate = (models) => {
    Product.belongsTo(models.User);
    Product.belongsToMany(models.Client, {
      through: "ClientProduct", // The name of the intermediary table
    });
    Product.belongsTo(models.ProductType, {
      onDelete: "cascade", // Enable cascade delete from ProductType to Product
    });
  };
  return Product;
};
