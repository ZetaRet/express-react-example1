import { Request, Response } from "express";
import IndexCFG from "../IndexCFG";
import BaseController from "./BaseController";
import APIDataService from "../services/APIDataService";
import { LoginZod } from "../schemas/ZodSchemas";
import { ObjectId } from "mongodb";
import { IRequest } from "../interfaces/IRequest";

export default class APIController extends BaseController {
	public service: APIDataService;

	constructor() {
		super();
		this.service = new APIDataService();
		this.service.controller = this;
		this.links = [
			"login",
			"logout",
			"status",
			"seedAgents",
			"profile_data",
			"profile_another_data",
			"set_profile_data",
			"set_profile_other_data",
		];
		this.post["login"] = true;
		this.post["profile_another_data"] = true;
		this.post["set_profile_data"] = true;
		this.post["set_profile_other_data"] = true;
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
		let session = (req as IRequest).cookie.session;
		let uid = (req as IRequest).redisval;
		let user = (req as IRequest).user;
		if (IndexCFG.debug) console.log("#Logout", session, uid, user);
		IndexCFG.redis.set(session, "guest");
		(req as IRequest).redisval = "guest";
		(req as IRequest).user = null;
		res.send({ session });
	}

	status(req: Request, res: Response) {
		return this.service.status(req, res);
	}

	seedAgents(req: Request, res: Response) {
		return this.service.seedAgents(req, res);
	}

	profile_data(req: Request, res: Response) {
		return this.service.profile_data(req, res);
	}

	profile_another_data(req: Request, res: Response) {
		return this.service.profile_another_data(req, res);
	}

	set_profile_data(req: Request, res: Response) {
		return this.service.set_profile_data(req, res);
	}

	set_profile_other_data(req: Request, res: Response) {
		return this.service.set_profile_other_data(req, res);
	}
}
