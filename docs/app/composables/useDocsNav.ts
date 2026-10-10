export interface DocItem {
  title: string;
  path: string;
  description?: string;
  badge?: string;
  type?: "Component" | "Composable" | "Plugin" | "Utility" | "Pattern" | "Guide";
}

export interface DocCategory {
  category: string;
  items: DocItem[];
}

export const docCategories: DocCategory[] = [
  {
    category: "Overview",
    items: [
      {
        title: "Documentation Hub",
        path: "/",
        description: "Overview and directory of components, composables, utilities, and patterns",
      },
    ],
  },
  {
    category: "Nuxt · Components",
    items: [
      {
        title: "PP (Pretty Print)",
        path: "/nuxt/components/pp",
        description: "Collapsible JSON & debug data tree viewer with type tags and copying",
        badge: "Component",
        type: "Component",
      },
      {
        title: "DownloadFilesButton",
        path: "/nuxt/components/download-files-button",
        description: "Unified single file and ZIP batch downloader button",
        badge: "Component",
        type: "Component",
      },
    ],
  },
  {
    category: "Nuxt · Composables",
    items: [
      {
        title: "useApi",
        path: "/nuxt/composables/use-api",
        description: "Declarative SSR fetch wrapper with runtime proxy base URL and Bearer token",
        badge: "Composable",
        type: "Composable",
      },
      {
        title: "useFormattedProperties",
        path: "/nuxt/composables/use-formatted-properties",
        description: "Object property formatter for Start Case labels and date strings",
        badge: "Composable",
        type: "Composable",
      },
      {
        title: "useFileDownloader",
        path: "/nuxt/composables/use-file-downloader",
        description: "Client-side single file download composable with reactive progress tracking and toast alerts",
        badge: "Composable",
        type: "Composable",
      },
    ],
  },
  {
    category: "Nuxt · Plugins",
    items: [
      {
        title: "$api Plugin",
        path: "/nuxt/plugins/api",
        description: "Imperative $fetch client instance with Bearer auth injection and 401 logout handling",
        badge: "Plugin",
        type: "Plugin",
      },
    ],
  },
  {
    category: "Nuxt · Utilities",
    items: [
      {
        title: "downloadZip & Download Utilities",
        path: "/nuxt/utilities/download-zip",
        description: "Client-side ZIP bundling, direct file downloading, and secure server-side streaming utilities",
        badge: "Utility",
        type: "Utility",
      },
    ],
  },
  {
    category: "Nuxt · Patterns",
    items: [
      {
        title: "Authentication & Login Flow",
        path: "/nuxt/patterns/authentication-login",
        description: "Encrypted cookie auth session with Bearer token injection and middleware",
        badge: "Pattern",
        type: "Pattern",
      },
    ],
  },
];

export const useDocsNav = () => {
  const allItems = computed(() => {
    return docCategories.flatMap((c) => c.items);
  });

  const getSurround = (currentPath: string) => {
    const normalized = currentPath.replace(/\/$/, "") || "/";
    const items = allItems.value;
    const index = items.findIndex((item) => item.path === normalized);

    if (index === -1) {
      return { prev: null, next: null };
    }

    return {
      prev: index > 0 ? items[index - 1] : null,
      next: index < items.length - 1 ? items[index + 1] : null,
    };
  };

  return {
    categories: docCategories,
    allItems,
    getSurround,
  };
};
