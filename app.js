var http = require("http");
var fs = require("fs");
var path = require("path");

var server = http.createServer((req, res) => {
	if (req.url == "/") {
		res.writeHead(200, { "Content-Type": "text/html" });
		var myReadStream = fs.createReadStream(
			__dirname + "/src/index.html",
			"utf8"
		);
		myReadStream.pipe(res);
	} else if (req.url.match(".css$")) {
		sendAptFile(req, res, "text/css", "utf8");
	} else if (req.url.match(".js$")) {
		sendAptFile(req, res, "text/javascript", "utf8");
	} else if (req.url.match(".png$") || req.url.match(".jpg$")) {
		sendAptFile(req, res, `image/${req.url.match(".png$") ? "png" : "jpeg"}`);
	} else if (req.url.match(".mp3$")) {
		sendAptFile(req, res, "audio/mgep");
	}
});

server.listen(3000, "127.0.0.1");
console.log("Running At: http://127.0.0.1:3000/");

// *************************Functions***************************

function sendAptFile(req, res, ct, encd) {
	res.writeHead(200, { "Content-Type": ct });
	var myPath = path.join(__dirname, "src", req.url);
	var fileStream = fs.createReadStream(myPath, encd);
	fileStream.pipe(res);
}
