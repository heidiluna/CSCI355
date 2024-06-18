
const http = require("http");
const fs = require("fs");
const url = require("url");
const port = 3000;

let userDB = []

const server = http.createServer();


server 
.on("listening",
    () => console.log(`Server listening on port ${port}`))
.on("request", (req, res) => {
    const method = req.method;
    const url = req.url;
    console.log(url);
    if( url === "/signup" ){
    const signupPage = fs.createReadStream("signup.html")
    signupPage.pipe(res);
    } else if ( method === "GET" && url.startsWith("/signup/submit")){
       const signupURL = new URL(`localhost:3000${url}`);
       const username = signupURL.searchParams.get("username");
       const password = signupURL.searchParams.get("password");
       res.end(`This is ${username}'s passwprd: ${password}`); 
    } else if ( method === "POST" && url.startsWith("/signup/submit") ){
        let userInput = "";
        req.on("data" , (dataChunk) => {
            userInput += dataChunk;
        });
        req.on("end" , () =>{
            const userInputParams = new URLSearchParams(userInput);
            const fname = userInputParams.get("fname");
            const lname = userInputParams.get("lname");
            const username = userInputParams.get("username");
            const password = userInputParams.get("password");
            let newUser = {
                fname: fname,
                lname: lname,
                username: username,
                password: password
            }
            userDB.push(newUser);
            fs.createReadStream("login.html").pipe(res);
             });
         } else if (method === "POST" && requestUrl === "/login/submit") {
            let loginInput = "";
            req.on("data", (dataChunk) => {
                loginInput += dataChunk;
            });
        req.on("end" , () => {
            const loginInputParams = new URLSearchParams(loginInput);
            const username = loginInputParams.get("username");
            const password = loginInputParams.get("password");
            const user = userDB.find(
                user => user.username === username && user.password === password
            );

            if (user) {
                res.end(`Welcome, ${user.fname} ${user.lname}! You have successfully logged in.`);
            } else {
                res.end("Invalid username or password. Please try again.");
            }
        });
    }

})
.listen(port);







/// sudo npm install -g nodemon
// nodemon index.js
/// steps to install 