// module.exports = {
//   MONGOURI:
//     "mongodb+srv://juliolozm20:rycvzarxF11a@cluster0.gaw1uep.mongodb.net/?retryWrites=true&w=majority",
//   JWT_SECRET: "ehhebtsdahf3asd",
// };

if (process.env.NODE_ENV === "production") {
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
