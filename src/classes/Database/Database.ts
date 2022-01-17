import mongoose from "mongoose";
import Models from "./Models";

class Database {
  databaseURI;
  models = new Models();
  constructor(mongoURI: string) {
    this.databaseURI = mongoURI;
  }

  async init(): Promise<void> {
    mongoose.set("overwriteModels", false);
    mongoose.Promise = global.Promise;

    mongoose.connection.on("connected", () => {
      console.log("Mongoose has successfully connected!");
    });

    mongoose.connection.on("err", (err: any) => {
      console.error(`Mongoose connection error: \n${err.stack}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("Mongoose connection lost");
    });

    await mongoose.connect(this.databaseURI, {
      autoIndex: false,

      maxPoolSize: 5,
      connectTimeoutMS: 10000,
      family: 4,
    });
  }
}
export default Database;
