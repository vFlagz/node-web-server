const http = require("http");
const port = 3000;

const server = http.createServer(function(req, res) {
    res.write("Hello node");
    res.end();
})

server.listen(port, function(error) {
    if(error) {
        console.log("something bad happend ", error);
    } else {
        console.log("server is listening on port " + port)
    }
})