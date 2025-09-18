import mongoose from "mongoose";

const URL = "mongodb://localhost:27017/"
const DB =  "uptc"

try {
    await mongoose.connect(URL + DB)
    console.log(`DB connected ${DB} Successfully`);
} catch (error) {
    console.log(error)
}

export default mongoose;

