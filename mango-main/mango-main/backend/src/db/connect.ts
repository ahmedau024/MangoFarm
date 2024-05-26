import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://test:" +
        encodeURIComponent("j5@_sr9-M#Gxpva") +
        "@atlascluster.sbxasjc.mongodb.net"
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));
};
export default connectDB;
