module.exports = (sequelize, Datatype) => {
  const User = sequelize.define("User", {
    firstname: {
      type: Datatype.STRING,
      allowNull: false,
    },
    lastname: {
      type: Datatype.STRING,
      allowNull: false,
    },
    username: {
      type: Datatype.STRING,
      allowNull: false,
    },
    email: {
      type: Datatype.STRING,
      allowNull: false,
    },
    password: {
      type: Datatype.STRING,
      allowNull: false,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Client, {
      onDelete: "cascade",
    });
    User.hasMany(models.ProductType, {
      onDelete: "cascade",
    });
    User.hasMany(models.Product, {
      onDelete: "cascade",
    });
  };
  return User;
};
