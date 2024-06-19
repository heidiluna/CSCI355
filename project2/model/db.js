const fs = require("fs");

function readUserDB(){

    const data = fs.readFileSync("./model/userDB.json", "utf-8");
    return JSON.parse(data);
}

function writeUserDB(){
    const data = JSON.stringify(userDB.json, null, 2);
    fs.writeFile("./model/userDB.json", data, "utf-8" );

}

module.exports = {
    readUserDB,
    writeUserDB

}