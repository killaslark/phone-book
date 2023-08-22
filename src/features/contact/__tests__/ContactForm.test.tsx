import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, waitForElementToBeRemoved } from "@testing-library/react";

import { ContactFormPageContent } from "../components";
import { mockContactFormCreateRequest, mockContactFormCreateResponse, mockContactFormDetailRequest, mockContactFormDetailResponse, mockContactFormEditNumberRequest, mockContactFormEditNumberResponse, mockContactFormEditRequest, mockContactFormEditResponse } from "../__mocks__";

const useRouter = jest.spyOn(require('next/router'), 'useRouter')
useRouter.mockImplementation(() => ({
  query: {},
}))

jest.useFakeTimers();
global.ResizeObserver = require('resize-observer-polyfill')



describe('Contact List', () => {
  it('Render Form Create Correctly', async () => {

    const mocks = [
      {
        request: mockContactFormCreateRequest,
        result: mockContactFormCreateResponse,
      }
    ]
    const { findByTestId, findByText, findAllByText, getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ContactFormPageContent />
      </MockedProvider>
    )

    const firstNameInput = getByTestId('contact-form-first-name')
    const lastNameInput = getByTestId('contact-form-last-name')
    const phoneNumberInput = getByTestId('contact-form-phone-number-0')

    expect(firstNameInput).toHaveValue(''); //empty
    expect(lastNameInput).toHaveValue(''); //empty
    expect(phoneNumberInput).toHaveValue(''); //empty

    const submitButton = getByTestId('contact-form-submit-button');

    fireEvent.click(submitButton);

    // required error on message is shown 
    expect(await findByText('First Name is required')).toBeInTheDocument();

    // test special character
    fireEvent.change(firstNameInput, { target: { value: 'Jhon *' } });
    fireEvent.change(lastNameInput, { target: { value: 'Dhoe*' } })
    fireEvent.change(phoneNumberInput, { target: { value: 123 } })

    fireEvent.click(submitButton);

    // custom input validation error message is shown 
    expect((await findAllByText('Name should not contains any special character')).length).toBe(2);
    expect(await findByText('Phone number format is invalid')).toBeInTheDocument();

    // ideal flow
    fireEvent.change(firstNameInput, { target: { value: 'Jhon' } });
    fireEvent.change(lastNameInput, { target: { value: 'Dhoe' } })
    fireEvent.change(phoneNumberInput, { target: { value: 1231421312 } })

    fireEvent.click(submitButton);

    const confirmModalButton = await findByTestId('contact-form-submit-confirm-modal-confirm');
    expect(confirmModalButton).toBeInTheDocument();

    fireEvent.click(confirmModalButton);

    expect(await findByTestId('contact-form-success-alert')).toBeInTheDocument();

  })

  it('Render Form Edit Success Correctly', async () => {
    useRouter.mockImplementation(() => ({
      query: { id: '4523' },
    }))
    const mocks = [
      {
        request: mockContactFormDetailRequest,
        result: mockContactFormDetailResponse,
      },
      {
        request: {
          ...mockContactFormEditRequest,
          variables: {
            id: "4523",
            _set: {
              first_name: "Jhon",
              last_name: "Dhoe"
            },
          }
        },
        result: mockContactFormEditResponse,
      }
    ]
    const { findByTestId, findByText, getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ContactFormPageContent />
      </MockedProvider>
    )

    expect(getByTestId('contact-form-loader')).toBeInTheDocument();

    // after fetch success
    const firstNameInput = await findByTestId('contact-form-first-name')
    const lastNameInput = getByTestId('contact-form-last-name')

    // prefilled from BE
    expect(firstNameInput).toHaveValue(mockContactFormDetailResponse.data.contact_by_pk.first_name); //empty
    expect(lastNameInput).toHaveValue(mockContactFormDetailResponse.data.contact_by_pk.last_name);

    const submitButton = getByTestId('contact-form-submit-button');


    // edit data success
    fireEvent.change(firstNameInput, { target: { value: 'Jhon' } })
    fireEvent.change(lastNameInput, { target: { value: 'Dhoe' } })

    fireEvent.click(submitButton);

    const confirmModalButton = await findByTestId('contact-form-submit-confirm-modal-confirm');
    expect(confirmModalButton).toBeInTheDocument();

    fireEvent.click(confirmModalButton);

    expect(await findByTestId('contact-form-success-alert')).toBeInTheDocument();


  })

  it('Render Form Edit Error Correctly', async () => {
    useRouter.mockImplementation(() => ({
      query: { id: '4523' },
    }))
    const mocks = [
      {
        request: mockContactFormDetailRequest,
        result: mockContactFormDetailResponse,
      },
      {
        request: {
          ...mockContactFormEditRequest,
          variables: {
            id: "4523",
            _set: {
              first_name: "Jhon",
              last_name: "Dhoe"
            },
          }
        },
        result: mockContactFormEditResponse,
      },
      {
        request: mockContactFormEditNumberRequest,
        result: mockContactFormEditNumberResponse,
      }
    ]
    const { findByTestId, getByTestId, findByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ContactFormPageContent />
      </MockedProvider>
    )

    const firstNameInput = await findByTestId('contact-form-first-name')
    const lastNameInput = getByTestId('contact-form-last-name')

    // edit data error
    fireEvent.change(firstNameInput, { target: { value: 'Jhon1' } })
    fireEvent.change(lastNameInput, { target: { value: 'Dhoe' } })

    const submitButton = getByTestId('contact-form-submit-button');

    fireEvent.click(submitButton);

    const confirmModalButtonErrorCase = await findByTestId('contact-form-submit-confirm-modal-confirm');
    expect(confirmModalButtonErrorCase).toBeInTheDocument();

    fireEvent.click(confirmModalButtonErrorCase);

    expect(await findByTestId('contact-form-error-alert')).toBeInTheDocument();


    const phoneNumberInput = getByTestId('contact-form-edit-phone');
    expect(phoneNumberInput).toBeDisabled();

    fireEvent.click(getByTestId('contact-form-edit-phone-edit-button'));


    // showing cancel edit
    expect(await findByTestId('contact-form-edit-phone-cancel-button')).toBeInTheDocument();

    const saveButton = await findByTestId('contact-form-edit-phone-edit-button');

    fireEvent.change(phoneNumberInput, { target: { value: 123 } })
    fireEvent.click(saveButton);

    // showing invalid format error message
    expect(await findByText('Phone number format is invalid')).toBeInTheDocument();

    fireEvent.change(phoneNumberInput, { target: { value: '' } })
    fireEvent.click(saveButton);

    // showing required error message
    expect(await findByText('Phone number is required')).toBeInTheDocument();

    fireEvent.change(phoneNumberInput, { target: { value: '1231421312' } })
    fireEvent.click(saveButton);


    const confirmButton = await findByTestId('contact-form-edit-phone-confirm-modal-confirm');

    fireEvent.click(confirmButton);

    expect(await findByTestId('contact-form-edit-phone-success-alert')).toBeInTheDocument();

  })
})