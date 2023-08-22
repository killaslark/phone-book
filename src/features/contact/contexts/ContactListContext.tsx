import React, {
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import { QueryResult } from '@apollo/client';
import debounce from 'lodash/debounce';

import { type Contact } from '../hooks/useContactDetail';
import {
  useContactList,
  type GetContactListParams,
  type GetContactListResponse,
} from '../hooks/useContactList';
import {
  addFavoriteContacts,
  deleteFavoriteContact,
  getFavoriteContacts,
  updateFavoriteContacts,
} from '../utils';

interface TContactListContext
  extends QueryResult<GetContactListResponse, GetContactListParams> {
  contactList: Contact[];
  favoriteContactList: Contact[];

  addFavoriteContact: (contact: Contact) => void;
  removeFavoriteContact: (id: string) => void;

  pageIndex: number;
  pageSize: number;
  onChangePageIndex: (pageIndex: number) => void;
  onChangePageSize: (pageSize: number) => void;

  searchKeyword?: string;
  onChangeSearchKeyword: (keyword: string) => void;
}

const ContactListContext = React.createContext<TContactListContext>(null!);

export const ContactListProvider = ({ children }: PropsWithChildren) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [favoriteContactList, setFavoriteContactList] = useState<Contact[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useLayoutEffect(() => {
    setFavoriteContactList(getFavoriteContacts());
  }, []);

  const onChangePageIndex = (pageIndex: number) =>
    setPagination(prevData => ({ ...prevData, pageIndex }));
  const onChangePageSize = (pageSize: number) =>
    setPagination(prevData => ({ ...prevData, pageSize }));

  const onChangeSearchKeyword = debounce(keyword => {
    setSearchKeyword(keyword);
    // reset page to 0
    onChangePageIndex(0);
  }, 500);

  const addFavoriteContact = (contact: Contact) => {
    addFavoriteContacts([contact]);
    setFavoriteContactList(contactList => [contact, ...contactList]);
  };

  const removeFavoriteContact = (id: string) => {
    deleteFavoriteContact(id);
    setFavoriteContactList(contactList =>
      contactList.filter(contact => contact.id !== id),
    );
  };

  const whereQuery: GetContactListParams['where'] = useMemo(() => {
    const trimmedKeyword = searchKeyword.trim();
    if (!trimmedKeyword) return;

    // if user search by phone number
    if (!Number.isNaN(Number(trimmedKeyword)))
      return {
        phones: {
          number: {
            _iregex: trimmedKeyword,
          },
        },
      };

    const splittedWords = trimmedKeyword.split(' ');

    if (splittedWords.length > 1) {
      const firstName = splittedWords[0];
      const lastName = splittedWords.slice(1).join(' ');

      return {
        first_name: {
          _iregex: firstName,
        },
        last_name: {
          _iregex: lastName,
        },
      };
    }

    return {
      first_name: {
        _iregex: trimmedKeyword,
      },
    };
  }, [searchKeyword]);

  const { contactList: fetchedContactList, ...res } = useContactList(
    {
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
      where: whereQuery,
    },
    {
      onCompleted: data => {
        // to ensure latest data of favorite contact is up to date
        updateFavoriteContacts(data.contact);
      },
    },
  );

  const contactList = useMemo(() => {
    return fetchedContactList.filter(
      contact =>
        !favoriteContactList.some(
          savedContact => savedContact.id === contact.id,
        ),
    );
  }, [favoriteContactList, fetchedContactList]);

  const value = {
    contactList,
    favoriteContactList,
    addFavoriteContact,
    removeFavoriteContact,

    ...pagination,
    onChangePageIndex,
    onChangePageSize,

    searchKeyword,
    onChangeSearchKeyword,

    ...res,
  };

  return (
    <ContactListContext.Provider value={value}>
      {children}
    </ContactListContext.Provider>
  );
};

export const useContactListProvider = () => useContext(ContactListContext);
