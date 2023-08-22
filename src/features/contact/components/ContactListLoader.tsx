import { useMemo } from 'react';

import { Card } from '@components';

import { useContactListProvider } from '../contexts';

interface Props {
  totalItems?: number;
}
export const ContactListLoader = ({ totalItems }: Props) => {
  const dummyList = useMemo(
    () => new Array(totalItems || 4).fill(null),
    [totalItems],
  );
  const { loading } = useContactListProvider();

  if (!loading) return null;

  return (
    <div data-testid='contact-list-loader' className="grid gap-2 w-full px-4">
      {dummyList.map((_item, idx) => (
        <Card key={idx}>
          <div className="w-full">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-slate-200 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-200 rounded"></div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
