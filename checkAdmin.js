require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const admin = await Admin.findOne({ email: "admin@aabhyafoundation.org" });
  console.log(admin);
  process.exit(0);
});