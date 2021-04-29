const mode = 1;

switch (mode) {
  case 1:
    module.exports = {
      port: process.env.PORT || 3000,
      uri: "mongodb://localhost:27017/hellothere",
    };
    break;

  default:
    break;
}
