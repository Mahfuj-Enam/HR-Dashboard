// Manually declare process to fix "Cannot find type definition file for 'vite/client'"
// and ensure process.env.API_KEY is available in the client code.
declare const process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  }
};
