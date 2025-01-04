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
		IndexCFG.mongodb.collection("agents").findOne({}, (err: any, result: any) => {
			console.log(result);
			res.send(result);
		});
	}
}
