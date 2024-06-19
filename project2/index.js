
const http = require("http");
const fs = require("fs");
const auth = require("./controller/auth.js");
const port = 3000;

let userDB = []

const server = http.createServer();

server
    .on("listening", 
        () => console.log(`Server listening on port ${port}`))
    .on("request", (req, res) => {
        const method = req.method;
        const url = req.url;
        console.log(userDB);
        if( url === "/" ){
            fs.createReadStream("./view/index.html").pipe(res); 
        }
        else if( url === "/signup" ) {
            fs.createReadStream("./view/signup.html").pipe(res); 
        } 
        else if( url === "/login" ) {
            fs.createReadStream("./view/login.html").pipe(res); 
        }
        else if( method === "GET" && url.startsWith("/signup/submit") ) {
            auth.signupSubmitGET(req, res, userDB);
        } 
        else if( method === "POST" && url.startsWith("/signup/submit") ){
            auth.signupSubmitPOST(req, res, userDB);
        }
        else if( method === "POST" && url.startsWith("/login/submit") ){
            auth.loginSubmitPOST(req, res, userDB);
        }

    })
    .listen(port);

