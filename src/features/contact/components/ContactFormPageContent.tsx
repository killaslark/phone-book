import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { Contact, useContactDetail } from '../hooks/useContactDetail';
import { useCreateContact } from '../hooks/useCreateContact';
import { useEditContact } from '../hooks/useEditContact';
import { ContactForm, type ContactFormShape } from './ContactForm';
import { ContactFormLoader } from './ContactFormLoader';
import { ContactEditPhoneForm } from './ContactEditPhoneForm';

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
    <>
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
    </>
  )
}
