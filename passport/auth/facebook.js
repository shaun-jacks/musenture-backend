const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const User = require("../../models/users");
const _ = require("lodash");
const config = require("config")[process.env.NODE_ENV || "development"];

const facebook_client_id = config.get("passport.facebook_client_id");
const facebook_client_secret = config.get("passport.facebook_client_secret");

passport.use(
  "facebookToken",
  new FacebookTokenStrategy(
    {
      clientID: facebook_client_id,
      clientSecret: facebook_client_secret,
      passReqToCallback: true,
      profileFields: ["id", "displayName", "photos", "email"]
    },
    async function(req, accessToken, refreshToken, profile, done) {
      console.log("FACEBOOK OAUTH CALLED");
      console.log(profile);
      const avatar = profile.photos ? profile.photos[0].value : "";
      // const providerID = profile.id;
      const email = profile.emails[0].value;
      const displayName = profile.displayName;

      // Search if user is already signed up
      let user = await User.findOne({
        email
      }).exec();
      console.log(user);
      // Register if not signed up
      if (_.isEmpty(user)) {
        // console.log(`Registering Facebook user to db`);
        user = new User({
          displayName,
          email,
          avatar,
          "providers.facebook": true
        });
        user = await user.save();
        console.log(user);
        return done(null, user);
      }
      // if user signed up with another provider, return error
      if (user.google || user.password) {
        return (
          null, false, { message: "Email registered with another provider" }
        );
      }

      // pass user to req object
      return done(null, user);
    }
  )
);
