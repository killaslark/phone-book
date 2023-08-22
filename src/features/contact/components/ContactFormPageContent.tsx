import { useCallback } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { useContactDetail } from '../hooks/useContactDetail';
import { useCreateContact } from '../hooks/useCreateContact';
import { useEditContact } from '../hooks/useEditContact';
import { ContactEditPhoneForm } from './ContactEditPhoneForm';
import { ContactForm, type ContactFormShape } from './ContactForm';
import { ContactFormLoader } from './ContactFormLoader';

export default function ContactFormPageContent() {
  const { query } = useRouter();

  const createMutation = useCreateContact();

  const editMutation = useEditContact();

  const contactDetailQuery = useContactDetail({ id: query.id as string });

  const handleSubmit = useCallback((contact: ContactFormShape) => {
    const { first_name, last_name } = contact;

    if (query.id) {

      editMutation.onEdit({
        variables: {
          id: query.id as string,
          _set: {
            first_name,
            last_name
          }
        },
        onError: console.error
      })
      return
    }

    createMutation.onCreate({
      variables: contact,
      onError: console.error,

      // optimistic update
      onCompleted: () => {
        contactDetailQuery.updateQuery(prevData => ({
          ...prevData,
          contact_by_pk: {
            ...prevData.contact_by_pk,
            first_name,
            last_name,
          }
        }))
      }
    })
  }, [query.id])

  const error = createMutation.error || editMutation.error;

  const loading = createMutation.loading || editMutation.loading;

  const success = (createMutation.data || editMutation.data) && {
    name: 'Success!',
    message: 'Contact has been successfully saved!'
  };

  if (contactDetailQuery.loading) {
    return <ContactFormLoader />;
  }


  if (contactDetailQuery.called && !contactDetailQuery.contact) {
    return <span>contact not found</span>
  }


  return (
    <div className='flex flex-col w-full space-y-4 pt-4'>
      <div className='px-4'>
        <Link href='/' passHref>
          <button className='text-blue-500 font-bold'>
            <div className='flex items-center space-x-2'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>

              <span>{'Back To Contact List'}</span>
            </div>
          </button>
        </Link>
      </div>
      <ContactForm
        initialValue={contactDetailQuery.contact}
        hidePhoneNumberField={!!query?.id}
        error={error}
        loading={loading}
        success={success}
        onSubmit={handleSubmit}
        submitLabel={query?.id ? 'Edit Name' : 'create'}
      />
      {!!query.id && contactDetailQuery?.contact && (<ContactEditPhoneForm phones={contactDetailQuery?.contact?.phones} id={query.id as string} />)}
    </div>
  )
}
