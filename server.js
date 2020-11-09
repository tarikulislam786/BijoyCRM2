const express = require("express");
const app = express();
const initRoutes = require("./routes/web");
const path = require("path");
// step 1
const PORT = process.env.PORT || 4000;
app.use(express.urlencoded({ extended: true }));
initRoutes(app);

if (process.env.NODE_ENV === "production") {
  // app.use(express.static("bijoy-crm-client/build"));
  app.use("uploads", express.static(path.join(__dirname, "uploads")));
  app.use(express.static(path.join(__dirname, "bijoy-crm-client/build")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "bijoy-crm-client", "build", "index.html")
    ); // relative path
  });
}
app.listen(PORT, () => {
  log(`Server is starting at PORT: ${PORT}`);
});

/*let port = 3000;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});*/
