export const aboutController = {
    index: {
      handler: function (request, h) {
        const viewData = {
          title: "About Enviro-Buddy",
        };
        return h.view("about-view", viewData);
      },
    },
  };
  