import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist';

import { FullScreenLoader } from '@components';
import config from '@config';

const cache = new InMemoryCache();

interface TPersistApolloContextValue {
  clearCache: () => void;
  persistor?: CachePersistor<NormalizedCacheObject>;
}

const PersistApolloContext = createContext<TPersistApolloContextValue>(null!);

export const usePersistApolloContext = () => useContext(PersistApolloContext);

const PersistApolloProvider = ({ children }: PropsWithChildren<{}>) => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();
  const [persistor, setPersistor] =
    useState<CachePersistor<NormalizedCacheObject>>();

  const initCachePersistor = useCallback(async () => {
    const persistor = new CachePersistor({
      cache,
      storage: new LocalStorageWrapper(window.localStorage),
      trigger: 'write',
    });

    try {
      await persistor.restore();
      setPersistor(persistor);
      const persistClient = new ApolloClient({
        uri: `${config.phoneBookAPI.host}/graphql`,
        cache,
      });
      setClient(persistClient);
    } catch (e) {
      setClient(
        new ApolloClient({
          uri: `${config.phoneBookAPI.host}/graphql`,
          cache,
        }),
      );
    }
  }, []);

  useEffect(() => {
    initCachePersistor();
  }, [initCachePersistor]);

  const clearCache = useCallback(() => {
    if (!persistor) {
      return;
    }
    persistor.purge();
  }, [persistor]);

  if (!client) {
    return <FullScreenLoader title={'Initializing the App...'} description='This may take a few seconds...' />;
  }

  return (
    <ApolloProvider client={client}>
      <PersistApolloContext.Provider value={{ persistor, clearCache }}>
        {children}
      </PersistApolloContext.Provider>
    </ApolloProvider>
  );
};

export default PersistApolloProvider;
