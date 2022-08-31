import { MessageSchema } from "../schema/message.schema.js";
import mongoose from "mongoose";
const uploadFile = async (request, response) => {
    try {
      if (request.session.user) {
        console.log(req.file, req.body);
        const { userName, email } = request.session.user;
        response.send({
          status: "OK",
          msg: "upload",
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
export {uploadFile };
