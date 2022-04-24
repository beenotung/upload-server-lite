http = require("http")
formidable = require("formidable")
listeningOn = require("listening-on")
fs = require("fs")

uploadDir = "uploads"

fs.mkdirSync(uploadDir, { recursive: true })

form = formidable({
  uploadDir,
  maxFileSize: 100 * 1024 ** 3,
  keepExtensions: true,
  filename: (name, ext, part, form) => {
    return part.originalFilename
  },
})

server = http.createServer((req, res) => {
  if (req.method === "GET") {
    res.setHeader("Content-Type", "text/html")
    res.end(`<html><body>
<form action="/" method="post" enctype="multipart/form-data">
  <input type="file" name="file" multiple/>
  <input type="submit" value="Upload">
</form>
</body></html>
`)
    return
  }
  if (req.method === "POST") {
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.setHeader("Content-Type", "text/plain")
        res.statusCode = 400
        res.end(String(err))
        return
      }
      res.setHeader("Content-Type", "application/json")
      res.end(JSON.stringify(files, null, 2) + "\n")
    })
    return
  }
  res.end("invalid method: " + req.method + "\n")
})

port = 8100
server.listen(port, () => {
  listeningOn.print(port)
})
