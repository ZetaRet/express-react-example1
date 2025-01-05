import { Request, Response } from "express";
import IndexCFG from "../IndexCFG";
import BaseController from "./BaseController";
import APIDataService from "../services/APIDataService";
import { LoginZod } from "../schemas/ZodSchemas";
import { ObjectId } from "mongodb";

export default class APIController extends BaseController {
	public service: APIDataService;

	constructor() {
		super();
		this.service = new APIDataService();
		this.links = ["login", "logout", "status", "seedAgents"];
		this.post["login"] = true;
	}

	async login(req: Request, res: Response) {
		const o = this;
		var uid: string = req.body.uid as string,
			password: string = req.body.password as string;
		const zodsafe: any = LoginZod.safeParse({ uid, password });
		if (!zodsafe.success) {
			res.send(o.returnError("validation", zodsafe.error.issues));
			return;
		}

		let sdata: any = await IndexCFG.getCookieData(req, res);
		var password_btoa = btoa(password);
		if (IndexCFG.debug) console.log("#login:", uid, password, password_btoa);

		IndexCFG.mongodb
			.collection("agents")
			.findOne({ _id: new ObjectId(uid), password: password_btoa }, async (err: any, result: any) => {
				if (IndexCFG.debug) console.log("#Login:", result);
				await IndexCFG.redis.set((req as any).cookie.session, uid);
				(req as any).redisval = uid;
				res.send({ cookie: sdata, db: result });
			});
	}

	logout(req: Request, res: Response) {
		const o = this;
		var params = req.params;
		params.password_btoa = btoa(params.password);
		if (IndexCFG.debug) console.log(params);
		IndexCFG.mongodb
			.collection("agents")
			.findOne({ uid: params.uid, password: params.password_btoa }, (err: any, result: any) => {
				if (IndexCFG.debug) console.log(result);
				res.send(result);
			});
	}

	status(req: Request, res: Response) {
		return this.service.status(req, res);
	}

	seedAgents(req: Request, res: Response) {
		return this.service.seedAgents(req, res);
	}
}
