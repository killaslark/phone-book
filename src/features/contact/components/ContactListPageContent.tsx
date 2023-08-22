import { Pagination } from '@components';

import { useContactListProvider } from '../contexts';
import { ContactCard } from './ContactCard';
import { ContactListHeader } from './ContactListHeader';
import { ContactListLoader } from './ContactListLoader';
import { RegularContactList } from './RegularContactList';
import { FavoriteContactList } from './FavoriteContactList';

const ContactListPageContent = () => {
  const { data, loading, pageIndex, pageSize, onChangePageIndex } =
    useContactListProvider();

  const handlePressNext = () => onChangePageIndex(pageIndex + 1);
  const handlePressPrevious = () => onChangePageIndex(pageIndex - 1);

  const originalContactList = data?.contact || [];

  return (
    <div className="flex flex-col justify-between w-full pb-4 space-y-4 ">
      <ContactListHeader />
      <FavoriteContactList />
      <RegularContactList />
      <ContactListLoader />

      {!loading && (
        <div className="flex grow-1 justify-center items-center">
          <Pagination
            currentPage={pageIndex + 1}
            disabledNext={originalContactList.length < pageSize}
            disabledPrevious={pageIndex === 0}
            onPressPrevious={handlePressPrevious}
            onPressNext={handlePressNext}
          />
        </div>
      )}
    </div>
  );
};

export default ContactListPageContent;
