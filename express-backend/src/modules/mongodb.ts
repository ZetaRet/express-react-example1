const mongoose = require("mongoose");
import IndexCFG from "../IndexCFG";
import { ConfigENUM } from "./config";

export default async function mongodb(app: any) {
	var mongoname = ConfigENUM.enum.mongoname;
	if (IndexCFG.debug) console.log("#Connect to MongoClient");
	let uri = "mongodb://" + ConfigENUM.enum.mongohost + ":" + ConfigENUM.enum.mongoport + "/" + mongoname;
	if (IndexCFG.debug) console.log(uri);
	mongoose.set("strictQuery", true);
	mongoose
		.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
		.then((client: any) => {
			if (IndexCFG.debug) console.log("#Connected to MongoDB");
			var db = mongoose.connection;
			IndexCFG.mongodb = db;
			IndexCFG.mongocollection = db.collection(mongoname);
		})
		.catch((error: any) => {
			console.error("Connection error", error);
		});
}
