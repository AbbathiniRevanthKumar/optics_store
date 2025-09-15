const { db } = require("../models");

exports.findByEmail = async (email) => {
  const user = await db.User.findOne({ where: { email: email } });

  return user;
};

exports.createUser = async (userDetails) => {
  const [user] = await db.User.upsert({
    name : userDetails.name,
    email: userDetails.email,
    password: userDetails.password,
    role: userDetails.role,
    auth_type : userDetails.auth_type
  });

  return user;
};
