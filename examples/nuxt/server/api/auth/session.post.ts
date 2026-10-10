// Thin session-seal route for browser-egress auth. See docs/content/nuxt/4.patterns/1.authentication-login.md
export default eventHandler(async (event) => {
  const body = await readBody(event);

  // Whitelist fields only — never trust arbitrary session data from the client.
  const { user, token, loggedInAt } = body ?? {};
  const data: Record<string, unknown> = {};
  if (user !== undefined) data.user = user;
  if (token !== undefined) data.token = token;
  if (loggedInAt !== undefined) data.loggedInAt = loggedInAt;

  // setUserSession deep-merges with the existing session, so posting only
  // `{ user }` for profile/password updates keeps the existing token intact.
  await setUserSession(event, data);

  return { status_code: 200 };
});
