import { createClient } from "redis";
import IndexCFG from "../IndexCFG";
import { ConfigENUM } from "./config";

export default async function redis(app: any) {
	if (IndexCFG.debug) console.log("#Redis Connect");
	let rurl: string = "redis://" + ConfigENUM.enum.redishost + ":" + ConfigENUM.enum.redisport;
	let ruser: string = ConfigENUM.enum.redisuser;
	let rpass: string = ConfigENUM.enum.redispass;
	const client = await createClient({ url: rurl, username: ruser, password: rpass })
		.on("error", (err: any) => console.log("#Redis Client Error", err))
		.connect();

	IndexCFG.redis = client;
}
