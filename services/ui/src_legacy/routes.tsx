const AppRoutes = {
  Debugger: () => `/debugger`,
  Device: {
    Index: () => `/device`,
    View: (id: string = ":id") => `/device/${id}`,
  },
  Members: {
    Index: () => `/members`,
  },
};

export default AppRoutes;
