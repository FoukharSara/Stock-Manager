module.exports = (sequelize, Datatype) => {
  const ProductType = sequelize.define("ProductType", {
    label: {
      type: Datatype.STRING,
      allowNull: false,
    },
  });

  ProductType.associate = (models) => {
    ProductType.hasMany(models.Product, {
      onDelete: "cascade",
    });
    ProductType.belongsTo(models.User);
  };
  return ProductType;
};
