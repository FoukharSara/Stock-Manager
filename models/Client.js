module.exports = (sequelize, Datatype) => {
  const Client = sequelize.define("Client", {
    companyname: {
      type: Datatype.STRING,
      allowNull: false,
    },
    email: {
      type: Datatype.STRING,
      allowNull: false,
    },
    phone: {
      type: Datatype.INTEGER,
      allowNull: false,
    },
    addedby: {
      type: Datatype.STRING,
      allowNull: false,
    }
  });
  
  Client.associate = (models) => {
    Client.belongsToMany(models.Product, {
      through: "ClientProduct", // The name of the intermediary table
    });
    Client.hasMany(models.ClientProduct, { 
      foreignKey: 'clientId'
     });
    Client.belongsTo(models.User);
  };
  return Client;
};
