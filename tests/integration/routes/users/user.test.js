const User = require("../../../../models/users");
const request = require("supertest");
let { mongoDisconnect, initDatabase } = require("../../../../models");

const ROUTE = "/users";

let server;
describe(`${ROUTE}`, () => {
  beforeAll(async () => {
    try {
      server = require("../../../../app");
      initDatabase();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    // First create user
    let reqBody = {
      displayName: "test1",
      email: "test@test.com",
      password: "Testing123!",
      password2: "Testing123!"
    };
    await request(server)
      .post(`/users/auth/register`)
      .send(reqBody);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("GET /me should return 200 if request has authorization for request", async () => {
    const url = `${ROUTE}/me`;

    // log existing user in
    reqBody = {
      email: "test@test.com",
      password: "Testing123!"
    };
    // Extract token from login
    const { text: token } = await request(server)
      .post(`/users/auth/local`)
      .send(reqBody);

    // Use token and set in header to get /me
    res = await request(server)
      .get(url)
      .set("x-auth-token", token);

    expect(res.status).toBe(200);
  });

  it("PUT /me should return 200 if request has authorization and with updated user", async () => {
    const url = `${ROUTE}/`;

    // log existing user in
    let reqBody = {
      email: "test@test.com",
      password: "Testing123!"
    };
    // Extract token from login
    const { text: token } = await request(server)
      .post(`/users/auth/local`)
      .send(reqBody);

    reqBody = {
      displayName: "testName1",
      bio: "testBio1",
      instrument: "testInstrument1",
      skill: "testSkill1"
    };

    // Use token and set in header to get /me
    res = await request(server)
      .put(url)
      .set("x-auth-token", token);

    console.log(res);

    expect(res.status).toBe(200);
    expect(res.body.n).toBe(1);
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

// Get Me
// router.get("/me", authenticate, async (req, res) => {
//   const { id } = req.user;
//   console.log("GET REQUEST to /me");
//   try {
//     let user = await User.findOne({ _id: id });
//     console.log(user);
//     if (_.isEmpty(user)) {
//       return res.status(400).json({ error: "User not found." });
//     }
//     const sanitizedUser = {
//       id: user._id,
//       displayName: user.displayName,
//       instrument: user.instrument,
//       bio: user.bio,
//       skill: user.skill,
//       avatar: user.avatar,
//       avatarLarge: user.avatarLarge,
//       followers: user.followers,
//       following: user.following
//     };
//     console.log("GET Success", sanitizedUser);
//     return res.status(200).json({ user: sanitizedUser });
//   } catch (error) {
//     return res.status(400).json({ error });
//   }
// });
