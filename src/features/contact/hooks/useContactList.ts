import { QueryHookOptions, gql, useQuery } from '@apollo/client';

import {
  type OrderType,
  type WhereComparisonType,
  type WhereConjunctionType,
} from '@common-types/query';
import { type Contact } from './useContactDetail';

type OrderBy = {
  [key in keyof Contact]: OrderType;
};

type SimpleWhereType =
  | Partial<{
      [key in keyof Omit<Contact, 'phones'>]: Partial<{
        [key in WhereComparisonType]: string;
      }>;
    }>
  | {
      phones: {
        number: Partial<{
          [key in WhereComparisonType]: string;
        }>;
      };
    };

type WhereWithConjuction = Partial<{
  [key in WhereConjunctionType]: SimpleWhereType;
}>;

export interface GetContactListParams {
  distinct_on?: 'created_at' | 'first_name' | 'id' | 'last_name' | 'updated_at';
  limit?: number;
  offset?: number;
  order_by?: OrderBy;
  where?: SimpleWhereType | WhereWithConjuction;
}

export interface GetContactListResponse {
  contact: Contact[];
}

const GET_CONTACT_LIST_QUERY = gql(`
  query GetContactList (
    $distinct_on: [contact_select_column!], 
    $limit: Int, 
    $offset: Int, 
    $order_by: [contact_order_by!], 
    $where: contact_bool_exp
  ) {
    contact(
        distinct_on: $distinct_on, 
        limit: $limit, 
        offset: $offset, 
        order_by: $order_by, 
        where: $where
    ){
      created_at
      first_name
      id
      last_name
      phones {
        number
      }
    }
  }
`);

type QueryConfig = Omit<
  QueryHookOptions<GetContactListResponse, GetContactListParams>,
  'variables'
>;

export const useContactList = (
  variables?: GetContactListParams,
  config?: QueryConfig,
) => {
  const res = useQuery<GetContactListResponse, GetContactListParams>(
    GET_CONTACT_LIST_QUERY,
    {
      variables: variables,
      ...config,
    },
  );

  return { contactList: res?.data?.contact || [], ...res };
};
