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

### Server Options

Format: `npx upload-server-lite [port] [maxFileSize] [secret]`

#### To specify port:

- `npx upload-server-lite 8080`

Remark: The `PORT` environment variable is also supported.

#### To specify maxFileSize:

- `npx upload-server-lite 200K`

Example format of max file size:

- `200` or `200B` => 200 bytes
- `300K` => 300 kilobytes
- `10M` => 10 megabytes
- `2G` => 2 gigabytes
- `1T` => 1 terabyte
- `2P` => 2 petabytes

#### To specify access secret:

- `npx upload-server-lite --secret=any-long-string`

Remark: The `SECRET` environment variable is also supported.

#### To specify any options in any order:

- `npx upload-server-lite --secret=any-long-string 8080 10M`
- `npx upload-server-lite 2G 8080`

## License

This project is licensed with [BSD-2-Clause](./LICENSE)

This is free, libre, and open-source software. It comes down to four essential freedoms [[ref]](https://seirdy.one/2021/01/27/whatsapp-and-the-domestication-of-users.html#fnref:2):

- The freedom to run the program as you wish, for any purpose
- The freedom to study how the program works, and change it so it does your computing as you wish
- The freedom to redistribute copies so you can help others
- The freedom to distribute copies of your modified versions to others
