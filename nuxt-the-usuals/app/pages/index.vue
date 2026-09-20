<script setup lang="ts">
// Root — send to dashboard when sealed, else to login.
const { loggedIn, session, fetch: fetchSession } = useUserSession();
if (!session.value) await fetchSession();
await navigateTo(loggedIn.value ? "/dashboard" : "/login");
</script>

<template>
  <div />
</template>
