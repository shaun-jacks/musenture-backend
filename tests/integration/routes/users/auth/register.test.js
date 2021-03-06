const User = require("../../../../../models/users");
const request = require("supertest");
let { mongoDisconnect, initDatabase } = require("../../../../../models");
const PORT = require("config")[process.env.NODE_ENV || "test"].get("port");

const ROUTE = "/users/auth/register";
let server;
describe(`${ROUTE}`, () => {
  beforeAll(async () => {
    try {
      server = require("../../../../../app");
      initDatabase();
    } catch (err) {
      console.log(err);
    }
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should return 401 if passwords do not match", async () => {
    const reqBody = {
      displayName: "test1",
      email: "test@test.com",
      password: "Testing123",
      password2: "Testing123!"
    };
    const res = await request(server)
      .post(`${ROUTE}`)
      .send(reqBody);
    expect(res.status).toBe(401);
  });

  it("should return 401 if password is not valid", async () => {
    const reqBody = {
      displayName: "test1",
      email: "test.com",
      password: "Testing123",
      password2: "Testing123"
    };
    const res = await request(server)
      .post(`${ROUTE}`)
      .send(reqBody);
    expect(res.status).toBe(401);
  });

  it("should return 401 if email is not valid", async () => {
    const reqBody = {
      displayName: "test1",
      email: "test.com",
      password: "Testing123!",
      password2: "Testing123!"
    };
    const res = await request(server)
      .post(`${ROUTE}`)
      .send(reqBody);
    expect(res.status).toBe(401);
  });

  it("should return 401 if displayName is missing", async () => {
    const reqBody = {
      email: "test.com",
      password: "Testing123",
      password2: "Testing123"
    };
    const res = await request(server)
      .post(`${ROUTE}`)
      .send(reqBody);
    expect(res.status).toBe(401);
  });

  it("should return 200 on successful register", async () => {
    const reqBody = {
      displayName: "test1",
      email: "test@test.com",
      password: "Testing123!",
      password2: "Testing123!"
    };
    const res = await request(server)
      .post(`${ROUTE}`)
      .send(reqBody);
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    console.log("Disconnecting mongo...");
    await mongoDisconnect();
    console.log("Disconnecting mongo done");
    try {
      server.close();
    } catch (err) {
      console.log(err);
    }
    console.log("Closing server done!");
  });
});
