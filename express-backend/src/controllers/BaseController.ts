import { Request, Response, Router } from "express";

export default class BaseController {
	public links: string[] = [];
	public post: any = {};

	constructor() {}

	configRouter(router: Router) {
		const o: any = this;
		o.links.forEach((e: string) => {
			o[e] = o[e].bind(o);
			router[o.post[e] ? "post" : "get"]("/" + e + "/", o[e]);
		});
	}

	__default(req: Request, res: Response) {
		res.send("");
	}

	async findMany(result: any) {
		var findmany: any[] = [];
		for await (var doc of result) {
			findmany.push(doc);
		}
		return findmany;
	}
}
