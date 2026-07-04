require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
    process.exit(1);
  }

  const exists = await Admin.findOne({ email: ADMIN_EMAIL });
  if (exists) {
    console.log(`Admin already exists for ${ADMIN_EMAIL}`);
    process.exit(0);
  }

  await Admin.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "superadmin",
  });

  console.log(`Superadmin created: ${ADMIN_EMAIL}`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
