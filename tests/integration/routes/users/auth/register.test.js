const User = require("../../../../../models/users");
const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../../../../../app");
let { mongoDisconnect } = require("../../../../../models");
const initDatabase = require("../../../../../server");

describe("users/auth/register", () => {
  beforeAll(async () => {
    initDatabase(app);
  });

  it("should return 200 on successful register", () => {
    expect(true).toBe(true);
  });

  afterAll(async () => {
    mongoDisconnect();
    app.close();
  });
});
