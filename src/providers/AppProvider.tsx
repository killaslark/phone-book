import { PropsWithChildren } from 'react';

import PersistApolloProvider from './PersistApolloProvider';

// put all app related providers here (theme, query-client provider, etc)
const AppProvider = ({ children }: PropsWithChildren<{}>) => {
  return <PersistApolloProvider>{children}</PersistApolloProvider>;
};

export default AppProvider;
