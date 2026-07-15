//This layer directly communicates to the DataBase...
import userModel from "../schema/userModel.js";


export const findUser = async (filter) => {
  return await userModel.findOne(filter);
};

export const createUser = async ({ name, email, password }) => {
  const newUser = new userModel({
    name,
    email,
    password: password,
  });
  return await newUser.save(); //also we can use return await newUser.create({data})...
};
