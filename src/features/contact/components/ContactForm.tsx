import { Controller, useFieldArray, useForm } from "react-hook-form";
import { type Contact } from "../hooks/useContactDetail";
import { ConfirmationModal, InputField } from "@components";
import { useEffect, useState } from "react";
import { nameValidation, phoneValidation } from "../constants";

export type ContactFormShape = Pick<Contact, 'first_name' | 'last_name' | 'phones'>;

interface Props {
  initialValue?: ContactFormShape;
  onSubmit: (contact: ContactFormShape) => void;
  hidePhoneNumberField?: boolean;
  loading?: boolean;
  error?: {
    name: string;
    message: string;
  } | null
  success?: {
    name: string;
    message: string;
  } | null
  submitLabel?: string;
}
export const ContactForm = ({ initialValue, onSubmit, hidePhoneNumberField, error, success, submitLabel, loading }: Props) => {

  const [openModal, setOpenModal] = useState(false);
  const { control, handleSubmit, reset } = useForm<ContactFormShape>({
    defaultValues: {
      first_name: '',
      last_name: '',
      phones: [
        {
          number: '',
        },
      ],
    },
  });

  useEffect(() => {
    if (initialValue) {
      reset(initialValue)
    }
  }, [initialValue])

  const phonesField = useFieldArray({
    control,
    name: 'phones',
  });

  const handlePressSubmit = handleSubmit(() => setOpenModal(true));

  const handleConfirmSubmit = handleSubmit(data => {
    setOpenModal(false);
    onSubmit(data);
  });

  return (
    <div className="flex flex-col w-full h-full max-w-lg px-4 self-center justify-self-center items-center">
      <span className="mb-4 font-bold text-lg">{'Contact Form'}</span>
      <form className="w-full space-y-4 bg-white shadow-md rounded px-4 pt-6 pb-8 mb-4">
        <Controller
          control={control}
          name="first_name"
          rules={{
            required: 'First Name is required',
            validate: (value: string) => {
              if (!nameValidation.test(value))
                return 'Name should not contains any special character';
            },
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <InputField
              placeholder='Jhon'
              label="First Name"
              value={value}
              onChange={onChange}
              errorMessage={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="last_name"
          rules={{
            required: 'Last Name is required',
            validate: (value: string) => {
              if (!nameValidation.test(value))
                return 'Name should not contains any special character';
            },
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <InputField
              label="Last Name"
              placeholder='Doe'
              value={value}
              onChange={onChange}
              errorMessage={error?.message}
            />
          )}
        />
        {!hidePhoneNumberField && (<>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {'Phone Number'}
          </label>
          {phonesField.fields.map((phone, idx) => (
            <Controller
              key={phone.id}
              control={control}
              name={`phones.${idx}.number`}
              rules={{
                required: 'Phone number is required',
                validate: (value: string) => {
                  if (!phoneValidation.test(value))
                    return 'Phone number format is invalid';
                },
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <div key={phone.id} className="flex flex-row space-x-2">
                  <div className="flex grow items-start">
                    <InputField
                      type="tel"
                      placeholder="085212331231"
                      value={value}
                      onChange={onChange}
                      errorMessage={error?.message}
                    />
                  </div>
                  {phonesField.fields.length !== 1 && (
                    <button
                      onClick={() => phonesField.remove(idx)}
                      className="mt-1 rounded self-start bg-red-500 hover:bg-red-700 text-sm text-white py-2 px-4 focus:outline-none focus:shadow-outline"
                      type="button"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
                      </svg>

                    </button>
                  )}
                </div>
              )}
            />
          ))}

          <div className="flex grow justify-end">
            <button
              onClick={() => phonesField.append({ number: '' })}
              className="self-center bg-blue-500 hover:bg-blue-700 text-sm text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">{success.name}</strong>
            <span className="block sm:inline">{success.message}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">{error.name}</strong>
            <span className="block sm:inline">{error.message}</span>
          </div>
        )}

        {loading ? (
          <svg
            aria-hidden="true"
            className="self-center justify-center inline w-6 h-6 text-gray-500 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        ) : (
          <button
            onClick={handlePressSubmit}
            className="justify-center bg-blue-500 hover:bg-blue-700 text-sm font-bold text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            {submitLabel || 'Create'}
          </button>
        )}
      </form>
      <ConfirmationModal
        title={`are you sure to ${submitLabel?.toLowerCase() || 'create'} this data?`}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
}