import * as z from "zod";
import { BodySizeEnum, BodyTypeEnum, RaceEnum, TypeEnum } from "../enum/BaseEnum";

export const LoginZod = z.object({
	uid: z.string().min(1),
	password: z.string().min(1),
});

export const ProfileAnotherZod = z.object({
	uid: z.string().min(1),
});

export const SetProfileZod = z.object({
	name: z.string().min(1).optional(),
	body_type: z.nativeEnum(BodyTypeEnum).optional(),
	body_size: z.nativeEnum(BodySizeEnum).optional(),
	type: z.nativeEnum(TypeEnum).optional(),
	race: z.nativeEnum(RaceEnum).optional(),
	color1: z.object({ r: z.number(), g: z.number(), b: z.number() }).optional(),
	color2: z.object({ r: z.number(), g: z.number(), b: z.number() }).optional(),
});

export const SetProfileOtherZod = z.object({
	face: z.string().min(1).optional(),
	eyes: z.string().min(1).optional(),
	skin: z.string().min(1).optional(),
	mood: z.string().min(1).optional(),
	language: z.string().min(1).optional(),
	religion: z.string().min(1).optional(),
	hairstyle: z.string().min(1).optional(),
	dresscode: z.string().min(1).optional(),
	glasses: z.string().min(1).optional(),
	hat: z.string().min(1).optional(),
	textures: z.string().min(1).optional(),
});
