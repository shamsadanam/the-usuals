// POST /api/auth/session — thin "session-seal" route.
//
// WHAT IT DOES
// Writes an already-authenticated payload into the encrypted, http-only
// nuxt-auth-utils session cookie. That's it. It makes NO backend/network call
// of its own.
//
// WHY IT EXISTS (the important part)
// In this deployment the Node/Nitro process (PM2) canNOT egress to the upstream
// backend API — only the *browser* can reach it. So the usual "server calls the
// auth API and sets the cookie" pattern is impossible. Instead:
//
//   1. The browser calls the backend directly (login / validate token / profile
//      update) and gets back { user, token }.
//   2. The browser POSTs that result here.
//   3. This route seals it into the encrypted cookie via setUserSession().
//
// The cookie is the source of truth the rest of the app reads through
// `useUserSession()` (login state, bearer token for `$api({ auth: true })`,
// middleware guards). See the guide in ./session.post.md.
//
// SECURITY NOTE
// The client can send anything, so we whitelist fields and never spread `body`
// straight into the session. The session cookie itself is signed+encrypted with
// NUXT_SESSION_PASSWORD (32+ chars) — a client cannot forge or read it, it can
// only ask this route to (re)seal a payload.
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
