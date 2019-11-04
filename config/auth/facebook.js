const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../../models/users");
const _ = require("lodash");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.facebookClientId,
      clientSecret: process.env.facebookClientSecret,
      callbackURL: process.env.facebookCallbackUrl,
      profileFields: ["id", "displayName", "photos", "email"]
    },
    async function(accessToken, refreshToken, profile, done) {
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
          avatar
        });
        user = await user.save();
        console.log(user);
        return done(null, user);
      }
      // if user signed up with another provider, return error
      // if (user.google.id || user.password) {
      //   return (
      //     null, false, { message: "Email registered with another provider" }
      //   );
      // }

      // pass user to req object
      return done(null, user);
    }
  )
);
