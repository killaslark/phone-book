import { MouseEventHandler, PropsWithChildren, useMemo, useState } from 'react';

import Link from 'next/link';

import { Card, ConfirmationModal } from '@components';
import { useContactListProvider } from '../contexts';
import { type Contact } from '../hooks/useContactDetail';
import { useDeieteContact } from '../hooks/useDeleteContact';
import { ContactPhotoPlaceholder } from './ContactPhotoPlaceholder';

interface Props {
  contact: Contact;
}
export const ContactCard = ({ contact }: PropsWithChildren<Props>) => {
  const {
    updateQuery,
    favoriteContactList,
    addFavoriteContact,
    removeFavoriteContact,
  } = useContactListProvider();
  const [openModal, setOpenModal] = useState(false);

  const { onDelete, loading } = useDeieteContact({
    variables: {
      id: contact.id,
    },
    // optimistic update
    onCompleted: data => {
      removeFavoriteContact(contact.id);
      updateQuery(prevRes => {
        return {
          ...prevRes,
          contact: prevRes.contact.filter(
            contact => contact.id !== data.delete_contact_by_pk.id,
          ),
        };
      });
    },
  });

  const isFavorite = useMemo(
    () =>
      favoriteContactList.some(
        favoriteContact => favoriteContact.id === contact.id,
      ),
    [favoriteContactList, contact],
  );

  const handleConfirmDelete = () => {
    setOpenModal(false);
    onDelete();
  };

  const handlePressLove: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    if (isFavorite) {
      removeFavoriteContact(contact.id);
      return;
    }
    addFavoriteContact(contact);
  };

  const handlePressDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setOpenModal(true);
  }

  return (
    <Link passHref href={`/contact/form?id=${contact.id}`}>
      <Card className="relative overflow-hidden w-full min-w-fit">
        <ContactPhotoPlaceholder
          first_name={contact.first_name}
          last_name={contact.last_name}
        />
        <div data-testid={`contact-list-card-${contact.id}`} className="ml-3 w-full">
          <div className="flex flex-row justify-between items-center space-x-1">
            <div className='flex flex-col grow overflow-hidden' style={{ maxWidth: 250 }}>
              <p className=" text-sm font-medium text-gray-900">{`${contact.first_name} ${contact.last_name}`}</p>
              {/* Intended for list only show first number */}
              <p className="text-sm text-gray-600">{contact.phones[0]?.number}</p>
            </div>
            <div className="flex flex-row items-center spacing-x-1 pr-2 ">
              <button
                data-testid={`contact-list-card-${contact.id}-delete-button`}
                onClick={handlePressDelete}
                className="rounded text-gray-400 absolute top-1 right-1"
              >
                {loading ? (
                  <svg
                    aria-hidden="true"
                    className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              <button
                data-testid={`contact-list-card-${contact.id}-love-button`}
                onClick={handlePressLove}
                className={isFavorite ? 'text-red-500' : 'text-gray-200'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8"
                >
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </button>
            </div>
            <ConfirmationModal
              testIdPrefix={'contact-list-delete'}
              title={`are you sure to delete contact with name ${contact.first_name}?`}
              isOpen={openModal}
              onClose={() => setOpenModal(false)}
              onConfirm={handleConfirmDelete}
            />
          </div>
        </div>
      </Card>
    </Link>
  );
};
