export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const viewData = {
        // Define your view data here
      };
      console.log(viewData);
      return h.view("dashboard-view", viewData);
    },
  },
};
