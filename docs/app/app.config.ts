export default defineAppConfig({
  ui: {
    colors: {
      primary: "indigo",
      neutral: "zinc",
    },
    button: {
      slots: {
        base: "cursor-pointer",
      },
    },
    prose: {
      code: {
        base: "font-mono font-medium rounded-md inline",
      },
      pre: {
        slots: {
          copy: "cursor-pointer",
        },
      },
    },
  },
});
