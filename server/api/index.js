const k = 12;
import { UserSchema } from "./schema/user.schema.js";
import mongoose from "mongoose";
// import Logger from "../logger/index";
const findOneOrCreate = async (request, response) => {
    const UserModel = mongoose.model("user", UserSchema);
    const { firstName, lastName, email, phone, password } = request;
    // Logger.info(password + "=====>password")
    const record = await UserModel.findOne({ email });
    // Logger.info(record)
    if (record) {
        response.json({ ...record, message: "record alredy exits" });
    } else {
        UserModel.create({ firstName, lastName, email, phone, password }).then((result) => {
            if (result) {
                response.json({ post, result });
            } else {
                response.json({ post, msg: "getting an error", result });
            }
        }).catch((Error) =>
            response.json({ post, msg: "getting an error" + Error })
        );
    }
}
const home=(request, response)=>{
    response.json({ post:{}, msg: "Home works"})
}
// export default {k, home};
export { k, home };