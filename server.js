var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8888;

// Create server
http.createServer(function(request, response) {

  // Parse the request URL to get the file path
  var uri = url.parse(request.url).pathname,
      filename = path.join(process.cwd(), uri);

  // If file doesn't exist, return 404
  if (!fs.existsSync(filename)) {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not Found\n");
    response.end();
    return;
  }

  // If the request is for a directory, serve index.html (ie if request is "/")
  if (fs.statSync(filename).isDirectory()) filename += '/index.html';


  fs.readFile(filename, "binary", function(err, file) {
    if(err) {        
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(err + "\n");
      response.end();
      return;
    }

    // Split filename on . to get extension
    const ext = path.extname(filename);
    console.log("Serving file: " + filename + " with extension: " + ext);
    let mimeType = "text/plain";
    if (ext === ".js") {
      mimeType = "application/javascript";
    } else if (ext === ".css") {
      mimeType = "text/css";
    } else if (ext === ".html" || ext === ".htm") {
      mimeType = "text/html";
    } else if (ext === ".json") {
      mimeType = "application/json";
    }
    console.log("MIME type: " + mimeType);


    response.writeHead(200, { "Content-Type": mimeType });
    response.write(file, "binary");
    response.end();
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");