const AppRoutes = {
  Debugger: () => `/debugger`,
  Device: {
    Index: () => `/device`,
    View: (id: string = ":id") => `/device/${id}`,
  },
  Members: {
    Index: () => `/members`,
  },
  Logging: {
    Index: () => "/logging",
  },
};

export default AppRoutes;
