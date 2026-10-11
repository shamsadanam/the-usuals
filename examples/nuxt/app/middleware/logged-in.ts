// On a cold load `session.value` is empty until fetched, so fetch first.
export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, session, fetch: fetchSession } = useUserSession();
  const { auth } = useAppConfig();

  if (!session.value) await fetchSession();
  if (!loggedIn.value) {
    return navigateTo({ path: auth.loginRoute, query: { redirect: to.fullPath } });
  }
});
