import { Request, Response } from "express";
import IndexCFG from "../IndexCFG";
import BaseController from "./BaseController";
import { ObjectID } from "bson";

export default class APIController extends BaseController {
	public debug: boolean = true;

	constructor() {
		super();
		this.links = ["login", "logout", "status"];
		this.post["login"] = true;
	}

	async login(req: Request, res: Response) {
		const o = this;
		let sdata: any = await IndexCFG.getCookieData(req, res);
		var uid: string = req.body.uid as string,
			password: string = req.body.password as string;
		var password_btoa = btoa(password);
		console.log("#login:", uid, password, password_btoa);

		IndexCFG.mongodb
			.collection("agents")
			.findOne({ _id: new ObjectID(uid), password: password_btoa }, async (err: any, result: any) => {
				if (o.debug) console.log("#Login:", result);
				await IndexCFG.redis.set((req as any).cookie.session, uid);
				(req as any).redisval = uid;
				res.send({ cookie: sdata, db: result });
			});
	}

	logout(req: Request, res: Response) {
		const o = this;
		var params = req.params;
		params.password_btoa = btoa(params.password);
		if (o.debug) console.log(params);
		IndexCFG.mongodb
			.collection("agents")
			.findOne({ uid: params.uid, password: params.password_btoa }, (err: any, result: any) => {
				if (o.debug) console.log(result);
				res.send(result);
			});
	}

	status(req: Request, res: Response) {
		const o = this;
		let result: any = {};
		result.cookie = (req as any).cookie.session;
		result.uid = (req as any).redisval;
		res.send(result);
	}
}
