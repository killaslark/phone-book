import { MutationHookOptions, gql, useMutation } from '@apollo/client';

import { type Contact } from './useContactDetail';

export interface EditPhoneParams {
  pk_columns: {
    number: string;
    contact_id: string;
  },
  new_phone_number: string;
}

export interface EditPhoneResponse {
  update_phone_by_pk: {
    contact: Contact;
  }
}

export const EDIT_PHONE_QUERY = gql(`
  mutation EditPhoneNumber($pk_columns: phone_pk_columns_input!, $new_phone_number:String!) {
    update_phone_by_pk(pk_columns: $pk_columns, _set: {number: $new_phone_number}) {
      contact {
        id
        last_name
        first_name
        created_at
        phones {
          number
        }
      }
    }
  }
`);

export const useEditPhone = (
  config?: MutationHookOptions<EditPhoneResponse, EditPhoneParams>,
) => {
  const [mutate, { loading, error, data }] = useMutation<
    EditPhoneResponse,
    EditPhoneParams
  >(EDIT_PHONE_QUERY, config);

  return { onEdit: mutate, loading, error, data };
};
