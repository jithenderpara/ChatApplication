const k = 12;
import { UserSchema } from "./schema/user.schema.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
// import Logger from "../logger/index";
const findOneOrCreate = async (request, response) => {
  console.log("Im in Login controller")
  const UserModel = mongoose.model(process.env.USER_COLLECTION_NAME, UserSchema);
  const post = request.body;
  const { fullName, email, password } = post;
  // Logger.info(password + "=====>password")
  console.log(post);
  const record = await UserModel.findOne({ email });
  // Logger.info(record)
  if (record) {   
    response.send({
      status: "Fail",
      msg: "That email is already taken, please try another.",
      url: "/login",
    });
  } else {
    UserModel.create({ fullName, email, password })
      .then((result) => {
        if (result) {
          response.send({  status: "OK", msg: "Sucess Register", url: "/login" });
        } else {
          response.json({ post, msg: "getting an error", result });
        }
      })
      .catch((Error) =>
        response.json({ post, msg: "getting an error" + Error })
      );
  }
};
const checkAccountValid = async (request, response) => {
  const UserModel = mongoose.model(process.env.USER_COLLECTION_NAME, UserSchema);
  const post = request.body;
  const { email, password } = post;
  console.log(post)
  const record = await UserModel.findOne({ email });
  console.log(record)
  // Logger.info(record)
  if (!record) {
    response.send({ status: "Fail", msg: "Invalid Email id", url: "/login" });
  } else {
    if (password == record.password) {
      var cleanUser = {
        userName: record.fullName,
        password: password,
        email: email,
      };

      request.session.user = cleanUser;
      request.user = cleanUser;
      await UserModel.findOneAndUpdate(
        {
          email,
        },
        { lastLogin: new Date() },
        { upsert: true, useFindAndModify: false }
      );

      response.send({
        status: "OK",
        msg: "Sucess login",
        url: "/home",
      });
    } else {
      response.send({ status: "Fail", msg: "Invalid Password", url: "/login" });
    }
  }
};
const userInfo = async (request, response) => {
  try {
    if (request.session.user) {
      const { userName, email } = request.session.user;
      response.send({
        status: "OK",
        msg: { userName, email },
        url: null,
      });
    } else {
      response.send({
        status: "Fail",
        msg: "Session expired please login again",
        url: "/login",
      });
    }
  } catch (Error) {
    response.json({ msg: "getting an error" + Error });
  }
};
const uploadFile = async (request, response) => {
    try {
      if (request.session.user) {
        const { userName, email } = request.session.user;
        response.send({
          status: "OK",
          msg: { userName, email },
          url: null,
        });
      } else {
        response.send({
          status: "Fail",
          msg: "Session expired please login again",
          url: "/login",
        });
      }
    } catch (Error) {
      response.json({ msg: "getting an error" + Error });
    }
  };
export { userInfo, checkAccountValid, findOneOrCreate, uploadFile };
