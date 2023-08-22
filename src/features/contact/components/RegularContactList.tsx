import { useContactListProvider } from '../contexts';
import { ContactCard } from './ContactCard';

export const RegularContactList = () => {
  const { contactList, loading } = useContactListProvider();

  if (loading) return null;

  return (
    <div className="grid gap-2 w-full px-4 overflow-hidden">
      <span className="font-bold"> {'Regular Contacts: '}</span>
      {!contactList.length && (
        <span className="text-center text-gray-500">
          {
            'No result found for regular contact, some data might be shown on favorite list'
          }
        </span>
      )}

      {!!contactList.length &&
        contactList.map(contact => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
    </div>
  );
};
