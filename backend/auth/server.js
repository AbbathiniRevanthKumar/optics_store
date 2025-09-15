const app = require("./app");
const { consts } = require("./config/config");

app.listen(consts.app_port, () => {
    console.log(`Auth service is running at port : ${consts.app_port}`);
});
