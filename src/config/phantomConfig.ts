interface PhantomConfig {
  baseURL?: string;
  token?: string;
  onUnauthorized?: () => void;
  [key: string]: any;
}

const phantomConfig: PhantomConfig = {};

export const setPhantomConfig = (config: PhantomConfig) => {
  Object.assign(phantomConfig, config);
};

export const getPhantomConfig = (): PhantomConfig => phantomConfig;
