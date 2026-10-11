// For guest-only pages (login, register, forgot password).
export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, session, fetch: fetchSession } = useUserSession();
  const { auth } = useAppConfig();

  if (!session.value) await fetchSession();
  if (loggedIn.value) {
    return navigateTo(safeRedirect(to.query.redirect, auth.afterLoginRoute));
  }
});
