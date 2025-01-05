import * as z from "zod";

export const LoginZod = z.object({
	uid: z.string().min(1),
	password: z.string().min(1),
});
