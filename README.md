## Setup

Check the `setup` of [nest-react-factory-example1](https://github.com/ZetaRet/nest-react-factory-example1/) and proceed with the current `setup.md` for each new installation.  

## Technology

`Express` backend in typescript using small `React` frontend on top with short webpack plus router.  
Database is `MongoDB` with `Redis`, middleware authorization and postman.  

## Story

New arrival on the planet by an agent with shape-shifting soldiers from another universe. Each unit can authorize uniquely as the self and use the shape and other data to become the same agent.  
The main fem agent holds the credentials of the entire arrival separating them in body type (male, fem, robot) and size (small, medium, large, huge, massive).  
Each body can use 2 different colors (main, secondary). Other data is name/type/race and custom by key-value coming with enumeration of hard-coded options.  
Shapeshifters keep their original data by id.  

## Seeding

MongoDB is seeded with one main unit as the first agent using postman. Logging in with the main agent allows data retrieval of all shapeshifters authorization id.  
Authorization uses mongodb id and password stored in base64, passwords are kept encoded in the main journal schema collection for the frontend to decode using algorithm.  
Seeding of 10 random shapeshifters with gambled data using postman.  
