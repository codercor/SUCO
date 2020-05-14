let express = require("express");
(app = express()),
  (bodyParser = require("body-parser")),
  (server = require("http").Server(app));
(cors = require("cors")),
  (path = require("path")),
  (userController = require("./controllers/userController")),
  (postController = require("./controllers/postController"));

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userController);
app.use("/post", postController);

server.listen(85, () => console.log("Yayın başladı..."));
