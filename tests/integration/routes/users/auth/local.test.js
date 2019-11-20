const User = require("../../../../../models/users");
const request = require("supertest");
let { mongoDisconnect, initDatabase } = require("../../../../../models");

const ROUTE = "/users/auth/local";

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

  it("should return 401 if invalid email", async () => {
    const reqBody = {
      email: "test.com"
    };
    const res = await request(server)
      .post(`${ROUTE}`)
      .send(reqBody);
    expect(res.status).toBe(401);
  });

  it("should return 401 if user does not exist in database", async () => {
    const reqBody = {
      email: "test@test.com",
      password: "Testing123!"
    };
    const res = await request(server)
      .post(`${ROUTE}`)
      .send(reqBody);
    expect(res.status).toBe(401);
  });

  it("should return 401 if password is not valid", async () => {
    // First create test user in database
    let reqBody = {
      displayName: "test1",
      email: "test@test.com",
      password: "Testing123!",
      password2: "Testing123!"
    };
    let res = await request(server)
      .post(`/users/auth/register`)
      .send(reqBody);

    reqBody = {
      email: "test@test.com",
      password: "Testing123" // invalid password
    };

    // Next, login user
    res = await request(server)
      .post(`${ROUTE}`)
      .send(reqBody);
    expect(res.status).toBe(401);
  });

  it("should return 401 if password is missing", async () => {
    const reqBody = {
      email: "test@test.com"
    };
    const res = await request(server)
      .post(`${ROUTE}`)
      .send(reqBody);
    expect(res.status).toBe(401);
  });

  it("should return 200 on successful login", async () => {
    // First create test user in database
    let reqBody = {
      displayName: "test1",
      email: "test@test.com",
      password: "Testing123!",
      password2: "Testing123!"
    };
    let res = await request(server)
      .post(`/users/auth/register`)
      .send(reqBody);

    reqBody = {
      email: "test@test.com",
      password: "Testing123!"
    };
    res = await request(server)
      .post(`${ROUTE}`)
      .send(reqBody);
    console.log(res.error);
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    console.log("Disconnecting mongo...");
    await mongoDisconnect();
    console.log("Disconnecting mongo done");
    console.log("Closing server...");
    try {
      server.close();
    } catch (err) {
      console.log(err);
    }
    console.log("Closing server done");
  });
});
