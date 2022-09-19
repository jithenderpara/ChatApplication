
import { MessageSchema } from "../schema/message.schema";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const saveMessages = async (request, response) => {
    try {
        const MessageModel = mongoose.model(process.env.MESSAGE_COLLECTION_NAME, MessageSchema);
        const post = request.body;
        const { fullName, email, from, to,  message, type} = post;
        const record = await UserModel.findOne({ email });
        if (request.session.user) {
            if (record) {
                await MessageModel.findOneAndUpdate(
                    {
                        email,
                    },
                    {fullName, from , to,  message, type, createdDate: new Date() },
                    { upsert: true, useFindAndModify: false }
                ).catch((e)=>{
                   return response.send({
                        status: "Fail",
                        msg: "That email is already taken, please try another.",
                        url: "/login",
                    }); 
                });
                return response.send({ status: "OK", msg: "Message saved Sucess", url: "" });
               
            } else {
                MessageModel.create({email, fullName, from, to,  message, type, createdDate: new Date() })
                    .then((result) => {
                        if (result) {
                            response.send({ status: "OK", msg: "Message saved Sucess", url: "/login" });
                        } else {
                            response.json({ post, msg: "getting an error", result });
                        }
                    })
                    .catch((Error) =>
                        response.json({ post, msg: "getting an error" + Error })
                    );
            }
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
const getMessages = async (request, response) => {
    try {
        if (request.session.user) {
            const { userName } = request.session.user;
            const post = request.body;
            const { email } = post;
            const record = await MessageModel.findOne({ email });
            if(record){
              return response.send({
                status: "OK",
                msg: record,
                url: null,
                });
            }else
            return response.send({
                status: "OK",
                msg: "No data",
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
export { saveMessages, getMessages };