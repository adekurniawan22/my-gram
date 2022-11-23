const express = require("express");
const app = express();
const userRoute = require("./routers/userRoute");
const photoRoute = require("./routers/photoRoute");
const socialMediaRoute = require("./routers/socialMediaRoute");
const commentRoute = require("./routers/commentRoute");
const PORT = 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(userRoute);
app.use(photoRoute);
app.use(socialMediaRoute);
app.use(commentRoute);

app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});

module.exports = app;
