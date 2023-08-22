import { MutationHookOptions, gql, useMutation } from '@apollo/client';

import { type Contact } from './useContactDetail';

type CreateContactParams = Pick<Contact, 'first_name' | 'last_name' | 'phones'>

interface CreateContactResponse {
  insert_contact: {
    returning: Pick<Contact, 'first_name' | 'last_name' | 'phones' | 'id'>[];
  }
}

export const CREATE_CONTACT_QUERY = gql(`
  mutation AddContactWithPhones(
    $first_name: String!, 
    $last_name: String!, 
    $phones: [phone_insert_input!]!
  ) {
    insert_contact(
      objects: {
        first_name: $first_name, 
        last_name: 
        $last_name, phones: { 
          data: $phones
        }
      }
    ) {
      returning {
        first_name
        last_name
        id
        phones {
          number
        }
      }
    }
  }

`);

export const useCreateContact = (
  config?: MutationHookOptions<CreateContactResponse, CreateContactParams>,
) => {
  const [mutate, { loading, error, data }] = useMutation<
    CreateContactResponse,
    CreateContactParams
  >(CREATE_CONTACT_QUERY, config);

  return { onCreate: mutate, loading, error, data };
};
