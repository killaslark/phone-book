import { MutationHookOptions, gql, useMutation } from '@apollo/client';
import { type Contact } from './useContactDetail';

interface EditContactParams {
  id: string;
  _set: Partial<Omit<Contact, 'phones'>>
}

interface EditContactResponse {
  update_contact_by_pk: Pick<Contact, 'first_name' | 'last_name' | 'phones' | 'id'>;
}

const EDIT_CONTACT_QUERY = gql(`
  mutation EditContactById($id: Int!, $_set: contact_set_input) {
    update_contact_by_pk(pk_columns: {id: $id}, _set: $_set) {
      id
      first_name
      last_name
      phones {
        number
      }
    }
  }
`);

export const useEditContact = (
  config?: MutationHookOptions<EditContactResponse, EditContactParams>,
) => {
  const [mutate, { loading, error, data }] = useMutation<
    EditContactResponse,
    EditContactParams
  >(EDIT_CONTACT_QUERY, config);

  return { onEdit: mutate, loading, error, data };
};
