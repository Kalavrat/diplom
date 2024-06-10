const express = require("express");
const cors = require("cors");
const session = require("express-session");
const userRouter = require("./routes/user.routes");
const PORT = 5000;

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// app.use(function (req, res, next) {
// res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use(
  session({
    secret: "any_key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 1000000,
      sameSite: "lax",
    },
  })
);

app.use(express.static(__dirname + "/img"));
app.use("/api", userRouter);

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
