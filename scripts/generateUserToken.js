const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const id = parseInt(process.argv[2], 10);

if (!id) {
  return;
}

const token = jwt.sign(
  {
    id,
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["user"],
      "x-hasura-default-role": "user",
      "x-hasura-user-id": id.toString(),
    },
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

console.log("Token:\n" + token);
console.log("\nURL:\nhttps://smart-primer.netlify.app/login/" + token);
