// Route guard — bounce to /login when the session cookie isn't sealed.
// On a cold load `session.value` is empty until fetched, so fetch first.
export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, session, fetch: fetchSession } = useUserSession();

  if (!session.value) await fetchSession();
  if (!loggedIn.value) return navigateTo("/login");
});
