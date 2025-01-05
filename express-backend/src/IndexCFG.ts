import { Request, Response } from "express";

export default class IndexCFG {
	public static debug: boolean = true;

	public static sessionId: string = "session";
	public static sessionData: any = {};

	public static publicRoutes: string[] = [];

	public static mongodb: any;
	public static mongocollection: any;

	public static redis: any;
	public static cookieLength: number = 36;

	public static app: any = null;
	public static express: any = null;
	public static modules: any = [];

	public static charmap: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	public static rnd(l: number) {
		var str = "",
			chl = IndexCFG.charmap.length - 1;
		while (l--) str += IndexCFG.charmap.charAt(Math.round(Math.random() * chl));
		return str;
	}

	public static getRndArray(arr: any[]): any {
		return arr[Math.round(Math.random() * (arr.length - 1))];
	}

	public static getRndMinMax(min: number, max: number): number {
		return min + Math.round((max - min) * Math.random());
	}

	public static checkPublicRoute(route: string) {
		if (route.charAt(route.length - 1) !== "/") route += "/";
		var proute: boolean = IndexCFG.publicRoutes.indexOf(route) >= 0;
		return proute;
	}

	public static getCookie(req: Request) {
		const cookie: any = {};
		(req.headers.cookie || "").split(";").forEach((e: any) => {
			let ce = e.trim().split("=");
			if (ce[0].length === 0) return;
			cookie[ce[0]] = ce[1];
		});
		(req as any).cookie = cookie;
		return cookie;
	}

	public static getCookieName(req: Request, n: string) {
		return IndexCFG.getCookie(req)[n];
	}

	public static async setCookie(req: Request, res: Response) {
		let sid = IndexCFG.rnd(IndexCFG.cookieLength);
		await this.setSessionData(sid, req, res);
		return sid;
	}

	public static async setSessionData(sid: string, req: Request, res: Response) {
		res.cookie(IndexCFG.sessionId, sid);
		(res as any)[IndexCFG.sessionId] = sid;
		(req as any).cookie[IndexCFG.sessionId] = sid;
		let cdata: any = {};
		cdata[IndexCFG.sessionId] = sid;
		IndexCFG.sessionData[sid] = cdata;
		(req as any).redisval = await IndexCFG.redis.get(sid);
		if (!(req as any).redisval) {
			await IndexCFG.redis.set(sid, "guest");
			(req as any).redisval = "guest";
		}
	}

	public static async getCookieData(req: Request, res: Response) {
		await IndexCFG.checkCookie(req, res);
		return IndexCFG.sessionData[(req as any).cookie[IndexCFG.sessionId]];
	}

	public static async checkCookie(req: Request, res: Response) {
		let cname: string = IndexCFG.getCookieName(req, IndexCFG.sessionId);
		if (!cname) {
			IndexCFG.setCookie(req, res);
		} else {
			this.setSessionData(cname, req, res);
		}
	}
}
