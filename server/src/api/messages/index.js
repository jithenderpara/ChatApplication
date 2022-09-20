
import { MessageSchema } from "../schema/message.schema.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const saveMessages = async (request, response) => {
    try {
        const MessageModel = mongoose.model(process.env.MESSAGE_COLLECTION_NAME, MessageSchema);
        const post = request.body;
        const { fullName, email, from, to,  message, type} = post;  
        const record = await MessageModel.findOne({ email });
        console.log(record, "record")
        if (record) {
            const recordMsg= await MessageModel.update(
                {email},
                {$addToSet: {massages: {fullName, from , to,  message, type, createdDate: new Date() }} }
            );
            console.log(record);
            if (recordMsg) {
                return response.send({ status: "OK", msg: "Message saved Sucess", url: "" });
               
            } else {
                response.json({ post, msg: "getting an error" + Error })
            }
        } else {
            const recordMsg= await MessageModel.create(
                {email, massages: [{email, fullName, from , to,  message, type, createdDate: new Date() }]}
            );
            if (recordMsg) {
                return response.send({ status: "OK", msg: "Message saved Sucess", url: "" });
               
            } else {
                response.json({ post, msg: "getting an error" + Error })
            }
        }
    } catch (Error) {
        response.json({ msg: "getting an error" + Error });
    }
};
const getMessages = async (request, response) => {
    try {
        // if (!request.session.user) {
            const MessageModel = mongoose.model(process.env.MESSAGE_COLLECTION_NAME, MessageSchema);
            // const { userName } = request.session.user;
            const post = request.body;
            const { email, toUser } = post;
            let reqQuery={email}
            if(toUser){
                reqQuery={email, massages:{$elemMatch: {to: toUser}}}
            }
            console.log(reqQuery);
            const record = await MessageModel.findOne(reqQuery);
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
        // } else {
        //     response.send({
        //         status: "Fail",
        //         msg: "Session expired please login again",
        //         url: "/login",
        //     });
        // }
    } catch (Error) {
        response.json({ msg: "getting an error" + Error });
    }
};
export { saveMessages, getMessages };