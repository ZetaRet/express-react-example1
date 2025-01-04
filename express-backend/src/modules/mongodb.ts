const mongoose = require('mongoose');
import { ObjectId } from 'mongodb';
import IndexCFG from '../IndexCFG';
import { ConfigENUM } from './config';

console.log(mongoose);

export default async function mongodb(app: any) {
	var mongoname = ConfigENUM.enum.mongoname;
	console.log("#Connect to MongoClient");
	let uri = 'mongodb://' + ConfigENUM.enum.mongohost + ':' + ConfigENUM.enum.mongoport + '/' + mongoname;
	console.log(uri);
	mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
		.then((client: any) => {
			console.log('#Connected to MongoDB');
			var db = mongoose.connection;
			IndexCFG.mongodb = db;
			IndexCFG.mongocollection = db.collection(mongoname);
		})
		.catch((error: any) => { console.error('Connection error', error) });
}