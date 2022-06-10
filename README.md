# upload-server-lite

Minimal web server to accept file upload over the network

[![npm Package Version](https://img.shields.io/npm/v/upload-server-lite)](https://www.npmjs.com/package/upload-server-lite)
[![npm Package Version](https://img.shields.io/bundlephobia/min/upload-server-lite)](https://bundlephobia.com/package/upload-server-lite)
[![npm Package Version](https://img.shields.io/bundlephobia/minzip/upload-server-lite)](https://bundlephobia.com/package/upload-server-lite)

## Installation

```shell
# install as dev dependency
npm i -D upload-server-lite

# or install as global package
npm i -g upload-server-lite
```

## Usage

**Start the server**:

```shell
> npx upload-server-lite

listening on http://127.0.0.1:8100 (lo)
listening on http://192.168.1.3:8100 (wlp3s0)
```

You can specify the port from argument or env, e.g.:
- `npx upload-server-lite 8080`
- `PORT=8080 npx upload-server-lite`

**Upload from client**:

If the GUI is available, you use a web browser to upload files through the url printed form the server cli.

If GUI us not available, you can upload with `curl`:

For example:

```shell
> curl -F file=@package.json http://192.168.1.3:8100

{
  "file": {
    "size": 443,
    "filepath": "/path_of_cwd/uploads/package.json",
    "newFilename": "package.json",
    "mimetype": "application/octet-stream",
    "mtime": "2022-04-24T08:17:22.199Z",
    "originalFilename": "package.json"
  }
}
```

## License

This project is licensed with [BSD-2-Clause](./LICENSE)

This is free, libre, and open-source software. It comes down to four essential freedoms [[ref]](https://seirdy.one/2021/01/27/whatsapp-and-the-domestication-of-users.html#fnref:2):

- The freedom to run the program as you wish, for any purpose
- The freedom to study how the program works, and change it so it does your computing as you wish
- The freedom to redistribute copies so you can help others
- The freedom to distribute copies of your modified versions to others
