export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const url = getRequestURL(event);

  if (!config.public.apiBaseUrl) {
    throw new Error("apiUrl is not defined in runtime config");
  }

  // Remove /api/proxy prefix only
  const path = url.pathname.replace("/api/proxy", "");

  // Build final URL: base + path + query
  const targetUrl = config.public.apiBaseUrl + path + url.search;

  // This forwards:
  // - HTTP method
  // - Headers
  // - Body (JSON, form-data, etc.)
  // - Query params
  return proxyRequest(event, targetUrl);
});
