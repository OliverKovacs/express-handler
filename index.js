
//  express-handler.js
//  Oliver Kovacs 2019
//  CC-BY-NC-SA-4.0

// express framework supporting redirects and accessible dirs
// configuration can be changed in ./config.json


class ExpressHandler {
    constructor() {

        // express module
        this.express = require("express");
        this.app = this.express();
        this.serv = require("http").Server(this.app);

        // settings for this module
        this.config = require("./config.json");
        this.redirects = this.config.redirects;

        // accessible directories
        for (let i = 0; i < this.config.access.length; i++) {
            this.app.use(`${this.config.access[i]}`, this.express.static(`./${this.config.access[i]}`));
        }

        // redirects
        this.app.get("/:reqPath", (req, res) => {
            for (let i = 0; i < this.redirects.arr.length; i++) {
                if (req.params.reqPath == this.redirects.arr[i].fromPath) {
                    return res.sendFile(this.redirects.arr[i].toPath, { root: "."});
                }
            }
            res.sendFile(this.redirects.notFound, { root: "." });
        });

        // default path (/)
        this.app.get("/", (req, res) => {
            res.sendFile(this.redirects.default, { root: "." });
        });

        // listens on port
        if (this.config.azure == true) {
            this.serv.listen(process.env.PORT, () => console.log(`express-handler.js: listening on port ${process.env.PORT} (azure)`));
        } else {
            this.serv.listen(this.config.port, () => console.log(`express-handler.js: listening on port ${this.config.port}`));
        }
    }
}

module.exports = new ExpressHandler();