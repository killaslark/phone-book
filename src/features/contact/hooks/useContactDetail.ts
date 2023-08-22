import { useQuery, gql } from '@apollo/client';

export interface Contact {
  created_at: string; // ISO string
  first_name: string;
  id: string;
  last_name: string;
  phones: {
    number: string;
  }[];
}

interface GetContactDetailParams {
  id?: string;
}

interface GetContactDetailResponse {
  contact_by_pk: Contact;
}

export const CONTACT_DETAIL_QUERY = gql(`
  query GetContactDetail($id: Int!){
    contact_by_pk(id: $id) {
      last_name
      id
      first_name
      created_at
      phones {
        number
      }
    }
  }
`);

export const useContactDetail = (variables: GetContactDetailParams) => {
  const { data, loading, error, updateQuery, called } = useQuery<
    GetContactDetailResponse,
    GetContactDetailParams
  >(CONTACT_DETAIL_QUERY, {
    variables: variables,
    skip: !variables?.id,
  });

  return { contact: data?.contact_by_pk, loading, error, called, updateQuery };
};
