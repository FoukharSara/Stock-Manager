module.exports = (sequelize, DataTypes) => {
    const ClientProduct = sequelize.define("ClientProduct", {
      nombre: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    return ClientProduct;
  };
  