export const aboutController = {
    index: {
      auth: {
        mode: "try"
      },
      handler: function (request, h) {
        const viewData = {
          title: "About Enviro-Buddy",
          user: request.auth.credentials,
        };
          // console.log("about handler called");
          // console.log(request.auth.credentials);
        return h.view("about-view", viewData);
      },
    },
  };
  