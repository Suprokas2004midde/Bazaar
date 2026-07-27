import { createUser, findUser, updateUser } from "../repository/userRepository.js";
import { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } from "../config/serverConfig.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = async (id) => {
  return jwt.sign({ id }, JWT_SECRET);
};

export const regesterUserService = async ({ name, email, password }) => {
  //Check already exist or not
  const exist = await findUser({ email });
  if (exist) {
    throw{
      status: 400,
      message: "Email already exist",
    };
  }

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await createUser({ name, email, password: hashPassword });

  const token = await createToken(user._id);
  return token;
};

export const loginUserService = async ({ email, password }) => {
  const user = await findUser({ email });
  if (!user) {
    throw {
      status: 401,
      message: "User Doesn't Exist",
    };
  }
  //Checking the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw {
      status: 401,
      message: "Invalid Credentials",
    };
  }
  const token = await createToken(user._id);
  return token;
};

export const adminLoginService = async ({ email, password }) => {
  if(email === ADMIN_EMAIL && password === ADMIN_PASSWORD){
    const token = await createToken(email+password); //Token is consist of three part Header+Payload+Signature
    return token;
  }
  throw {
    status: 401,
    message: "Invalid Admin Credentials",
  };
};

export const getUserProfileService = async (userId) => {
  const user = await findUser({ _id: userId });
  if (!user) {
    throw {
      status: 404,
      message: "User not found",
    };
  }
  // Exclude password and cartData for security/size
  const { password, cartData, ...profile } = user.toObject ? user.toObject() : user;
  return profile;
};

export const updateUserProfileService = async (userId, updateData) => {
  // Prevent updating password or email via profile update service directly
  delete updateData.password;
  delete updateData.email;
  delete updateData.userId;

  const updatedUser = await updateUser(userId, updateData);
  if (!updatedUser) {
    throw {
      status: 404,
      message: "User not found",
    };
  }
  return updatedUser;
};