import { useContactListProvider } from '../contexts';
import { ContactCard } from './ContactCard';

export const FavoriteContactList = () => {
  const { favoriteContactList, loading } = useContactListProvider();

  if (loading || !favoriteContactList.length) return null;

  return (
    <div className="grid gap-2 w-full px-4">
      <span className="font-bold"> {'Favorite Lists: '}</span>
      {!!favoriteContactList.length &&
        favoriteContactList.map(contact => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
    </div>
  );
};
