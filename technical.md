## Collections  

units - id, password, role, name, type, race, body_type, body_size, color1, color2  
units_origin - id, unit_id, name, type, race, body_type, body_size, color1, color2  
unit_data - id, unit_id, key, value  
unit_data_origin - id, unit_id, key, value  
agent_storage - id, agent_id, unit_id, password  
tokens - id, unit_id, token  

## Redis  

cookie.COOKIE_RANDOM_36: unit_id  

## Enumerations

__Role ENUM:__ agent, unit  

__Base ENUM:__  

body_type: male, fem, robot  
body_size: small, medium, large, huge, massive  
name: Array selected  
type: shapeshifter, alien  
race: human, reptile, dominion  

color1 - #rgb string  
color2 - #rgb string  

__Other ENUM:__  

face: pretty, asian, continental, normal  
eyes: cat, dark, light, black, colorful  
skin: thin, thick, snake, soft, hard, cloth  
mood: sad, happy, aggressive, neutral  
language: alien, latin, english, medieval  
religion: neutral, cosmos, god  
hair_style: skinhead, short, stylish, long  
dress_code: casual, formal, villager, street, office, sports, home  
glasses: none, sun, computer, professor  
hat: none, winter, summer, mafia-bombe  
textures: spots, areas, various, images, clear  

## Forms

Login: id, password or token (checks units or tokens, create new token)  
Logout: (clear redis, keep token)  
View Profile: id, token, name, type, race, body_type, body_size, color1, color2; unit_data listing by unit_id  
Edit Profile:  
- name, type, race, color1, color2;  
- unit_data listing by unit_id;  
- add unique key-value data;  
- view all units by current and other data, including origin; select data to transfer to personal profile;  

