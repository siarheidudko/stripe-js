const store: {
  apiKey?: string;
} = {};

export const setApiKey = (apiKey: string) => (store.apiKey = apiKey);
export const getApiKey = () => store.apiKey;
