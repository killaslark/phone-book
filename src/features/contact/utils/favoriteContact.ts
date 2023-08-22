import uniqBy from 'lodash/uniqBy';

import { type Contact } from '../hooks/useContactDetail';

const FAVORITE_CONTACT_STORAGE_KEY = '__favContacts';

export const updateFavoriteContacts = (contacts: Contact[]) => {
  const savedContacts = getFavoriteContacts();
  const updatedContacts = savedContacts.map(savedContact => {
    const contact = contacts.find(contact => savedContact.id === contact.id);
    if (contact) return contact;
    return savedContact;
  });
  localStorage.setItem(
    FAVORITE_CONTACT_STORAGE_KEY,
    JSON.stringify(updatedContacts),
  );
};

export const deleteFavoriteContact = (id: string) => {
  const savedContacts = getFavoriteContacts();
  const updatedContacts = savedContacts.filter(
    savedContact => savedContact.id !== id,
  );

  localStorage.setItem(
    FAVORITE_CONTACT_STORAGE_KEY,
    JSON.stringify(updatedContacts),
  );
};

export const addFavoriteContacts = (contacts: Contact[]) => {
  const savedContacts = getFavoriteContacts();

  const updatedContacts = uniqBy(
    [contacts, savedContacts].flat(),
    contact => contact.id,
  );

  localStorage.setItem(
    FAVORITE_CONTACT_STORAGE_KEY,
    JSON.stringify(updatedContacts),
  );
};

export const getFavoriteContacts = () => {
  const stringifiedContact = localStorage.getItem(FAVORITE_CONTACT_STORAGE_KEY);

  if (!stringifiedContact) {
    return [];
  }

  const contacts: Contact[] = JSON.parse(stringifiedContact);

  return contacts;
};
