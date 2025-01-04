import { Request, Response } from "express";
import IndexCFG from "../IndexCFG";
import BaseController from "./BaseController";

export default class HomeController extends BaseController {
	constructor() {
		super();
		this.links = ["home", "agents"];
	}

	async home(req: Request, res: Response) {
		let sdata: any = await IndexCFG.getCookieData(req, res);
		res.send("end.");
	}

	agents(req: Request, res: Response) {
		IndexCFG.mongodb.collection("agents").find({}, async (err: any, result: any) => {
			var findmany: any[] = [];
			for await (var doc of result) {
				findmany.push(doc);
			}
			if (IndexCFG.debug) console.log(findmany);
			res.send(findmany);
		});
	}
}
