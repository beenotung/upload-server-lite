#!/usr/bin/env node

http = require("http")
formidable = require("formidable").default
listeningOn = require("listening-on")
fs = require("fs")

port = +process.env.PORT
sizeValue = 100
sizeUnit = "GB"
uploadDir = "uploads"

units = {}
units["B"] = 1024 ** 0
units["KB"] = 1024 ** 1
units["MB"] = 1024 ** 2
units["GB"] = 1024 ** 3
units["TB"] = 1024 ** 4
units["PB"] = 1024 ** 5

secret = process.env.SECRET

for (let i = 2; i < process.argv.length; i++) {
  let arg = process.argv[i]
  if (arg.startsWith("--secret=")) {
    secret = arg.slice("--secret=".length)
    continue
  }
  let value = parseFloat(arg)
  let unit = arg.replace(String(value), "").slice(0, 1)
  if (unit && unit + "B" in units) {
    unit += "B"
  }
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
  <form id="uploadForm" action="/" method="post" enctype="multipart/form-data" onsubmit="submitForm(event)">
    <input type="file" name="file" multiple/>
    <input id="submitButton" type="submit" value="Upload">
  </form>
  ${
    secret
      ? `
    <script>
      secretInput = document.createElement("input")
      secretInput.type = "password"
      secretInput.name = "secret"
      secretInput.placeholder = "access secret"
      secretInput.onchange = function(event) {
        uploadForm.action = "/?" + new URLSearchParams({ secret: secretInput.value })
      }
      uploadForm.insertBefore(document.createElement("br"), submitButton)
      uploadForm.insertBefore(secretInput, submitButton)
    </script>
    `
      : ""
  }
</body>
</html>`)
    return
  }
  if (req.method === "POST") {
    res.setHeader("Content-Type", "application/json")
    if (
      secret &&
      new URLSearchParams(req.url.split("?").pop()).get("secret") !== secret
    ) {
      res.statusCode = 401
      res.end(JSON.stringify({ error: "unauthorized" }) + "\n")
      return
    }
    fs.mkdirSync(uploadDir, { recursive: true })
    form = formidable({
      uploadDir,
      maxFileSize,
      keepExtensions: true,
      multiples: true,
      filter: (part) => {
        if (part.originalFilename.includes("/")) {
          return false
        }
        return true
      },
      filename: (name, ext, part, form) => {
        return part.originalFilename
      },
    })
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.statusCode = 400
        res.end(JSON.stringify({ error: String(err) }) + "\n")
        return
      }
      files.file?.forEach((file) => {
        console.log("uploaded:", file.originalFilename)
      })
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
