const { translate } = require("@vitalets/google-translate-api");

translate("Hola mundo", {
  from: "es",
  to: "en",
})
.then((result) => {
  console.log(result);
})
.catch((error) => {
  console.error(error);
});