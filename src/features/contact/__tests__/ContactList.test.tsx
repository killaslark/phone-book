import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';

import { ContactListPageContent } from '../components';
import { ContactListProvider } from '../contexts';
import { GET_CONTACT_LIST_QUERY } from '../hooks/useContactList';

import { mockContactDeleteRequest, mockContactDeleteResponse, mockContactsRequest, mockContactsResult } from '../__mocks__';

jest.useFakeTimers();
jest.mock('lodash/debounce', () => jest.fn(fn => fn)); // mocking debounce on typing search
global.ResizeObserver = require('resize-observer-polyfill')

describe('Contact List', () => {
  it('Render Initial Empty List Correctly', async () => {
    const mocks = [
      {
        request: {
          query: GET_CONTACT_LIST_QUERY,
          variables: {
            offset: 0,
            limit: 10,
            where: undefined
          },
        },
        result: {
          data: {
            contact: [],
          }
        }
      }
    ];
    const { findByTestId, getByTestId, queryByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ContactListProvider>
          <ContactListPageContent />
        </ContactListProvider>
      </MockedProvider>
    )

    // initially loading & the list is not shown
    expect(getByTestId('contact-list-header')).toBeInTheDocument()
    expect(getByTestId('contact-list-loader')).toBeInTheDocument();
    expect(queryByTestId('contact-list-pagination')).not.toBeInTheDocument();
    expect(queryByTestId('contact-list-favorite')).not.toBeInTheDocument();
    expect(queryByTestId('contact-list-regular')).not.toBeInTheDocument();

    // Empty Result
    expect(await findByTestId('contact-list-empty')).toBeInTheDocument();
  })

  it('Render List with Paging Correctly', async () => {
    const mocks = [
      {
        request: {
          query: GET_CONTACT_LIST_QUERY,
          variables: {
            offset: 0,
            limit: 10,
            where: undefined
          },
        },
        result: mockContactsResult
      },
      {
        request: {
          query: GET_CONTACT_LIST_QUERY,
          variables: {
            offset: 10,
            limit: 10,
            where: undefined
          },
        },
        result: {
          data: {
            contact: [],
          }
        },
      }
    ];

    const { findByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ContactListProvider>
          <ContactListPageContent />
        </ContactListProvider>
      </MockedProvider>
    )

    // Paging will shown
    expect(await findByTestId('contact-list-pagination')).toBeInTheDocument();

    expect(await findByTestId('contact-list-pagination-prev-button')).toBeDisabled();


    const nextButton = await findByTestId('contact-list-pagination-next-button');

    fireEvent.click(nextButton);

    // next page is empty and the next button should be disabled
    expect(await findByTestId('contact-list-empty')).toBeInTheDocument();
    expect(await findByTestId('contact-list-pagination-next-button')).toBeDisabled();

    const prevButton = await findByTestId('contact-list-pagination-prev-button');
    expect(prevButton).toBeEnabled();

    // back to first page and the button should be disabled back
    fireEvent.click(prevButton);
    expect(await findByTestId('contact-list-pagination-prev-button')).toBeDisabled();


  })

  it('Should able to search correctly', async () => {
    const mocks = [
      {
        request: mockContactsRequest,
        result: mockContactsResult,
      },
      {
        request: {
          ...mockContactsRequest,
          variables: {
            offset: 0,
            limit: 10,
            where: {
              first_name: {
                _iregex: "qqq"
              }
            }
          }
        },
        result: {
          data: {
            contact: mockContactsResult.data.contact.slice(0, 5)
          }
        },
      },

      {
        request: {
          ...mockContactsRequest,
          variables: {
            offset: 0,
            limit: 10,
            where: {
              phones: {
                number: {
                  _iregex: '123',
                },
              },
            }
          }
        },
        result: {
          data: {
            contact: mockContactsResult.data.contact.slice(0, 3)
          }
        },
      },

      {
        request: {
          ...mockContactsRequest,
          variables: {
            offset: 0,
            limit: 10,
            where: {
              first_name: {
                _iregex: "qqq"
              },
              last_name: {
                _iregex: 'aaa'
              }
            }
          }
        },
        result: {
          data: {
            contact: mockContactsResult.data.contact.slice(0, 1)
          }
        },
      }
    ];

    const { findByTestId, getByTestId, queryByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ContactListProvider>
          <ContactListPageContent />
        </ContactListProvider>
      </MockedProvider>
    )

    const searchInput = getByTestId('contact-list-search-input');

    // search by name  (result length is 5, expect pagination tobe hidden)
    fireEvent.change(searchInput, { target: { value: 'qqq' } })
    const contactListReguler = await findByTestId('contact-list-regular')
    expect(contactListReguler).toBeInTheDocument();

    // 1 child is header, the rest is card
    expect(contactListReguler.children.length).toBe(6);
    expect(queryByTestId('contact-list-pagination-next-button')).not.toBeInTheDocument();


    // search by phone number (result length is 3)
    fireEvent.change(searchInput, { target: { value: '123' } })
    expect((await findByTestId('contact-list-regular')).children.length).toBe(4);

    // search by first name and last name (result length is 2)
    fireEvent.change(searchInput, { target: { value: 'qqq aaa' } })
    expect((await findByTestId('contact-list-regular')).children.length).toBe(2);
  })


  it('Should able to delete or favorite the contact correctly', async () => {
    const mocks = [
      {
        request: mockContactsRequest,
        result: mockContactsResult,
      },
      {
        request: {
          ...mockContactDeleteRequest,
          variables: {
            id: 4643,
          }
        },
        result: mockContactDeleteResponse,
      }
    ];

    const { findByTestId, queryByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ContactListProvider>
          <ContactListPageContent />
        </ContactListProvider>
      </MockedProvider>
    )

    const firstCardId = mockContactsResult.data.contact[0].id;

    const favoriteButton = await findByTestId(`contact-list-card-${firstCardId}-love-button`);

    expect(favoriteButton).toBeInTheDocument();

    fireEvent.click(favoriteButton);

    const favoriteContactList = await findByTestId('contact-list-favorite')
    expect(favoriteContactList).toBeInTheDocument();
    // should render favorite contact correctly (+1 for header)
    expect((favoriteContactList).children.length).toBe(2);

    const removeFavoriteButton = await findByTestId(`contact-list-card-${firstCardId}-love-button`);

    fireEvent.click(removeFavoriteButton);

    // expect the favorite list disappear
    expect(queryByTestId('contact-list-favorite')).not.toBeInTheDocument();


    // removing contact
    const deleteContactButton = await findByTestId(`contact-list-card-${firstCardId}-delete-button`);
    fireEvent.click(deleteContactButton);

    const confirmDeleteButton = await findByTestId('contact-list-delete-confirm-modal-confirm');
    fireEvent.click(confirmDeleteButton);

    // removed
    await waitForElementToBeRemoved(() => queryByTestId(`contact-list-card-${firstCardId}-delete-button`));
  })
})