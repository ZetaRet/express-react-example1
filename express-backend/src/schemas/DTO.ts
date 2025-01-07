export interface SetProfileDTO {
	name?: string;
	body_type?: string;
	body_size?: string;
	type?: string;
	race?: string;
	color1?: { [rgb: string]: number };
	color2?: { [rgb: string]: number };
}

export interface SetProfileOtherDTO {
	face?: string;
	eyes?: string;
	skin?: string;
	mood?: string;
	language?: string;
	religion?: string;
	hairstyle?: string;
	dresscode?: string;
	glasses?: string;
	hat?: string;
	textures?: string;
}
