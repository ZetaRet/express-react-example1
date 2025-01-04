
Use of currently installed software:  
- apache2 version 2.4.52  
- node 19.9.0  
- npm 9.6.3  
- VSCode or code 1.96.2  
- TypeScript 5.7.2 (force override global)  
- chrome 131  
- postman 10 (non cloud version)  

Additional Software to install:  
- MongoDB Server 4.4.28  
- MongoDB Compass 1.39.1  
- Redis Server 7.4.1  
- Redis Insight 2.60.0  

__MongoDB__ server reached 4.4 end of life platform support, changes in effect are ubuntu version, cpu architecture and hardware requirements.  
Download `libssl1.1_1.1.0g-2ubuntu4_amd64.deb` or match libssl, `mongodb-org-server_4.4.28_amd64.deb`. If your `systemctl start mongod` and `systemctl enable mongod` reports failure of the service, make sure to remove previous version of mongo and override install with the `.deb` provided.  
Use of `mongoose` and mongo client driver for major 4. Major 5 to 7.  
Download `Redis-Insight-linux-amd64.deb` for redis server.  

__Global__ npm install (npm install -g name):  
- prettier 3.3.3 (prettier)  
- node (@types/node)  

__Express__ npm __package.json__ install:  
- @types/node  
- @types/express  
- express 5.0.1  
- body-parser 1.20.3  
- cookie-parser 1.4.7  
- cookie-session 2.1.0  
- mongodb 4.14.0  
- mongoose 6.7.4  
- redis 4.7.0  
- zod 3.23.8  

````
cd express-backend/
npm install
npm run tsc
````

__React__ npm __package.json__ install:  
- react 18.3.1  
- react-dom 18.3.1  
- react-router 6.28.0  
- react-router-dom 6.28.0  
- @babel/core 7.26.0  
- @babel/preset-react 7.25.9  
- babel-loader 9.2.1  
- webpack 5.96.1  
- webpack-cli 5.1.4  

````
cd ./../
npm install
npm run build
````

After successful install and build `cd express-backend/` type in terminal `npm run start`.  

