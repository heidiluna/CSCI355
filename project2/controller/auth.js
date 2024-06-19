
const fs = require("fs");

function loginSubmitPOST(req, res, userDB) {
    let userInput = "";
    req.on("data", (dataChunk) => {
        userInput += dataChunk;
    });
    req.on("end", () => {
        const userInputParams = new URLSearchParams(userInput);
        const username = userInputParams.get("username");
        const password = userInputParams.get("password");

        let loginSuccess = false;
        for(let user of userDB) {
            if(username === user.username && password === user.password){
                loginSuccess = true;
                fs.createReadStream("./view/home.html").pipe(res);
                break;
            }
        }

        if(loginSuccess === false){
            res.end("fail");
        }
    });
}

function signupSubmitPOST(req, res, userDB) {
    let userInput = "";
    req.on("data", (dataChunk) => {
        userInput += dataChunk;
    });
    req.on("end", () => {
        const userInputParams = new URLSearchParams(userInput);
        const fname = userInputParams.get("fname");
        const lname = userInputParams.get("lname");
        const username = userInputParams.get("username");
        const password = userInputParams.get("password");


        let createNewUser = true;
        for(let user of userDB){
            if(username === user.username){
                createNewUser = false;
                res.end("Username taken. Please try another username.")
            }
        }
        if(password.length < 3){
            createNewUser = false;
            res.end("Password too short. Please try another password.")
        }

        if(createNewUser){
            let newUser = {
                fname: fname,
                lname: lname,
                username: username,
                password: password
            }
            userDB.push(newUser);
            fs.createReadStream("./view/login.html").pipe(res);
        }
    });
}

function signupSubmitGET(req, res, userDB){
    const url = req.url;
    const signupURL = new URL(`localhost:3000${url}`);
    const username = signupURL.searchParams.get("username");
    const password = signupURL.searchParams.get("password");
    res.end(`This is ${username}'s password: ${password}`);
}

module.exports = {
    signupSubmitGET,
    signupSubmitPOST,
    loginSubmitPOST
};



