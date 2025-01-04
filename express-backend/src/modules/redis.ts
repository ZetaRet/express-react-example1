import { createClient } from "redis";
import IndexCFG from "../IndexCFG";

export default async function redis(app: any) {
	if (IndexCFG.debug) console.log("#Redis Connect");
	const client = await createClient()
		.on("error", (err: any) => console.log("Redis Client Error", err))
		.connect();

	await client.set("key", "value");
	const value = await client.get("key");
	if (IndexCFG.debug) console.log("#Redis Value:", value);
	IndexCFG.redis = client;
}
