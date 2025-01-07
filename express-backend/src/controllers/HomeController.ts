import { Request, Response } from "express";
import IndexCFG from "../IndexCFG";
import BaseController from "./BaseController";
import { BodySizeEnum, BodyTypeEnum, RaceEnum, TypeEnum } from "../enum/BaseEnum";
import {
	DressCodeEnum,
	EyesEnum,
	FaceEnum,
	GlassesEnum,
	HairStyleEnum,
	HatEnum,
	LanguageEnum,
	MoodEnum,
	ReligionEnum,
	SkinEnum,
	TexturesEnum,
} from "../enum/OtherEnum";

export default class HomeController extends BaseController {
	constructor() {
		super();
		this.links = ["home", "agents", "enums"];
	}

	async home(req: Request, res: Response) {
		let sdata: any = await IndexCFG.getCookieData(req, res);
		res.send("end.");
	}

	agents(req: Request, res: Response) {
		IndexCFG.mongodb.collection("agents").find({}, async (err: any, result: any) => {
			var findmany: any[] = await this.findMany(result);
			if (IndexCFG.debug) console.log(findmany);
			res.send(findmany);
		});
	}

	enums(req: Request, res: Response) {
		let resultd: any = {
			base: {
				body_type: Object.values(BodyTypeEnum),
				body_size: Object.values(BodySizeEnum),
				type: Object.values(TypeEnum),
				race: Object.values(RaceEnum),
			},
			other: {
				face: Object.values(FaceEnum),
				eyes: Object.values(EyesEnum),
				skin: Object.values(SkinEnum),
				mood: Object.values(MoodEnum),
				language: Object.values(LanguageEnum),
				religion: Object.values(ReligionEnum),
				hairstyle: Object.values(HairStyleEnum),
				dresscode: Object.values(DressCodeEnum),
				glasses: Object.values(GlassesEnum),
				hat: Object.values(HatEnum),
				textures: Object.values(TexturesEnum),
			},
		};
		res.send(resultd);
	}
}
