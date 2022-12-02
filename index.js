const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/Database");

connectDB();

const app = express();

app.use(bodyParser.json({limit: '500mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true, parameterLimit: 100000000000 }));


app.set("trust proxy", 1);


// Express configuration
app.set("port", process.env.PORT || 5000);

app.use(cors({ origin: "*" }));



app.get("/", (_req, res) => {
  res.send("API Running");
});



const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

// server.timeout = 5000000;

server.setTimeout(600 * 60 * 1000);

server.on('connection', function(socket) {
  socket.setTimeout(600 * 60 * 1000); // now works perfectly...
});

module.exports = server;
