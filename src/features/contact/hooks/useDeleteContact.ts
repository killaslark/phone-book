import { MutationHookOptions, gql, useMutation } from '@apollo/client';
import { Contact } from './useContactDetail';

interface DeleteContactParams {
  id: string;
}

interface DeleteContactResponse {
  delete_contact_by_pk: Pick<Contact, 'first_name' | 'last_name' | 'id'>;
}

const DELETE_CONTACT_QUERY = gql(`
  mutation MyMutation($id: Int!) {
    delete_contact_by_pk(id: $id) {
      first_name
      last_name
      id
    }
  }
`);

export const useDeieteContact = (
  config?: MutationHookOptions<DeleteContactResponse, DeleteContactParams>,
) => {
  const [mutate, { loading, error }] = useMutation<
    DeleteContactResponse,
    DeleteContactParams
  >(DELETE_CONTACT_QUERY, config);

  return { onDelete: mutate, loading, error };
};
