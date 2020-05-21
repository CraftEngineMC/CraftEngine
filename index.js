const http = require("http");

const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const express = require("express");
const {Sequelize, DataTypes} = require("sequelize");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const seq = new Sequelize({
    dialect: "sqlite",
    storage: "./craftyengine.db"
});

const User = seq.define("User", {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    maxServers: {
        type: DataTypes.INTEGER
    },
    isAdmin: {
        type: DataTypes.BOOLEAN
    },
    name: {
        type: DataTypes.STRING
    },
    avatarURL: {
        type: DataTypes.STRING
    }
});

const Server = seq.define("Server",{
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    initialized: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
});

Server.belongsTo(User, {
    as: "owner"
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(cookieparser());

app.use("/assets", express.static("public"));

app.use(async function(request, response, next) {
    if (request.cookies.auth) {
        request.user = await User.findOne({
            where: {
                token: request.cookies.auth
            }
        });
        if (request.user) {
            request.servers = await Server.findAll({
                where: {
                    ownerId: request.user.id
                }
            })
        }
    }
    next();
});

app.set("view engine", "pug");

app.use("/api", require("./routers/api")(seq));

app.get("/", function(request, response) {
    response.render("index", {
        title: "CraftyEngine",
        user: request.user,
        servers: request.servers
    });
});

(async function() {
    await User.sync({alter: true})
    await Server.sync({alter: true})
    server.listen(process.env.PORT || 80, function() {
        console.log("CraftyEngine is online!");
    });
})()