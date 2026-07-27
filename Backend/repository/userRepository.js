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

export const updateUser = async (userId, updateData) => {
  return await userModel.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select("-password -cartData"); 
  //.select -password means dont send password in the response
  //.select -cartData means dont send cartData in the response
  //{ new: true } return the updated userData
  //{ runValidators: true } run the validators
};
