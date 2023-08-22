import { PropsWithChildren } from 'react';

import PersistApolloProvider from './PersistApolloProvider';

const AppProvider = ({ children }: PropsWithChildren<{}>) => {
  return <PersistApolloProvider>{children}</PersistApolloProvider>;
};

export default AppProvider;
