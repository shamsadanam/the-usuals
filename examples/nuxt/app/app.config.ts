export default defineAppConfig({
  auth: {
    loginRoute: "/login",
    // Used when /login has no valid `?redirect=`; point it wherever signed-in users should land.
    afterLoginRoute: "/",
    afterLogoutRoute: "/",
  },
});
