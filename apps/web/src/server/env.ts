export type AppEnv = {
  Bindings: Env;
  Variables: {
    userId?: string;
    userRole?: 'customer' | 'admin';
  };
};
