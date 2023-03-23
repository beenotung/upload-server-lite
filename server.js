#!/usr/bin/env node

http = require("http")
formidable = require("formidable")
listeningOn = require("listening-on")
fs = require("fs")

port = +process.env.PORT
sizeValue = 100
sizeUnit = "G"
uploadDir = "uploads"

units = {}
units["B"] = 1024 ** 0
units["K"] = 1024 ** 1
units["M"] = 1024 ** 2
units["G"] = 1024 ** 3
units["T"] = 1024 ** 4
units["P"] = 1024 ** 5

for (let i = 2; i < process.argv.length; i++) {
  let arg = process.argv[i]
  let value = parseFloat(arg)
  let unit = arg.replace(String(value), "").slice(0, 1) || "B"
  let scale = units[unit]
  if (value && scale) {
    sizeValue = value
    sizeUnit = unit
  } else {
    port = parseInt(arg) || port
  }
}

maxFileSize = sizeValue * units[sizeUnit]
port = +port || 8100

fs.mkdirSync(uploadDir, { recursive: true })

form = formidable({
  uploadDir,
  maxFileSize,
  keepExtensions: true,
  filename: (name, ext, part, form) => {
    return part.originalFilename
  },
})

server = http.createServer((req, res) => {
  if (req.method === "GET") {
    res.setHeader("Content-Type", "text/html")
    res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <form action="/" method="post" enctype="multipart/form-data">
    <input type="file" name="file" multiple/>
    <input type="submit" value="Upload">
  </form>
</body>
</html>`)
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

server.listen(port, () => {
  listeningOn.print(port)
  console.log("maxFileSize:", sizeValue.toLocaleString(), sizeUnit)
})
