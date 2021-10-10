import express from 'express'; 
import cors from 'cors';
import env from 'dotenv';
import path from 'path';
//import jwt from 'express-jwt';
//import jwks from 'jwks-rsa';
import response from './models/response'; //Created pre-formatted uniform response

const app = express();

//configs
env.config();

// utilities
app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.resolve(__dirname, '../'))); //production
//app.use(express.static(path.resolve(__dirname, '../../frontend/build'))); //development

// routes
import getFile from './route/files.route';
import sensorsRoute from './route/sensors.route';
import intrudersRoute from './route/intruders.route';
// import homeRoute from './route/home.route';
// import userRoute from './route/user.route';

// api
app.use("/api/sensors", sensorsRoute);
app.use("/api/intruders", intrudersRoute);
// app.use("/api/home", homeRoute);
// app.use("/api/user", userRoute);

app.get("/files", getFile); 

app.get("/test", (req, res) => {
    let result = new response(200, [], {"page": "test"});
    res.status(result.status).json(result); //Return 200 result
});

app.get('*', (req: express.Request, res: express.Response) => {
    //res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html')); //development
    res.sendFile(path.resolve(__dirname, '../../', 'index.html')); //production
    //console.log(path.resolve(__dirname, '../../Frontend/build', 'index.html'));
});

export default app; //Export server for use in index.js
