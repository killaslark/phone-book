import { ConfirmationModal } from "@components";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { InputField } from "../../../components/InputField";
import { phoneValidation } from "../constants";
import { type Contact } from "../hooks/useContactDetail";
import { useEditPhone } from "../hooks/useEditPhone";

interface Props {
  phones?: Contact['phones']
  id: string;
}

export const ContactEditPhoneForm = ({ phones, id }: Props) => {
  const { control } = useForm({
    defaultValues: {
      phones
    }
  });

  const phonesField = useFieldArray({
    control,
    name: 'phones',
  });


  return (
    <div className="flex flex-col w-full h-full max-w-lg px-4 self-center justify-self-center items-center">
      <label className="block text-gray-700 text-lg font-bold mb-2">
        {'Edit Phone Number'}
      </label>
      <form className="w-full space-y-4 bg-white shadow-md rounded px-4 pt-6 pb-8 mb-4">
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
            render={({ field: { onChange, value } }) => (
              <PhoneField
                contactId={id}
                onChange={onChange}
                value={value}
                onEditPhone={() => console.log('asdas')}
              />
            )}
          />
        ))}
      </form>
    </div>
  )

}

interface PhoneFieldProps {
  contactId: string;
  value?: string
  onChange?: (...event: any[]) => void;
  onEditPhone: () => void;
}
const PhoneField = ({ contactId, value }: PhoneFieldProps) => {
  const [initialValue, setInitialValue] = useState(value);

  const [openModal, setOpenModal] = useState(false);
  const [isOnEditMode, setIsOnEditMode] = useState(false);

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      number: value,
    }
  })

  const { onEdit, loading, error, data } = useEditPhone({
    variables: {
      new_phone_number: value as string,
      pk_columns: {
        contact_id: contactId,
        number: initialValue as string,
      }
    }
  });

  const handleEdit = handleSubmit(({ number }) => {
    setOpenModal(false);
    onEdit({
      variables: {
        new_phone_number: number as string,
        pk_columns: {
          contact_id: contactId,
          number: initialValue as string,
        }
      },
      onCompleted: () => {
        setInitialValue(value);
        setIsOnEditMode(false);
      }
    })
  })

  const handlePressEdit = () => {
    if (isOnEditMode) {
      handleSubmit(() => setOpenModal(true))()
      return;
    }
    setIsOnEditMode(true);
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleCancelEdit = () => {
    setValue('number', initialValue);
    setIsOnEditMode(false)
  }

  const success = !!data?.update_phone_by_pk?.contact && {
    name: 'Success',
    message: 'Phone number successfully saved',
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-row space-x-2">
        <div className="flex grow items-start">
          <Controller
            control={control}
            name={`number`}
            rules={{
              validate: (value?: string) => {
                if (!value) return 'Phone number is required';
                if (!phoneValidation.test(value)) {
                  return 'Phone number format is invalid';
                }
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputField
                type="tel"
                placeholder="085212331231"
                value={value}
                onChange={onChange}
                errorMessage={error?.message}
                disabled={!isOnEditMode}
              />)}
          />
        </div>
        <button
          onClick={handlePressEdit}
          className="rounded self-start bg-blue-500 hover:bg-blue-700 text-sm text-white py-2 px-4 focus:outline-none focus:shadow-outline"
          type="button"
        >
          {!isOnEditMode && !loading && (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
          )}
          {!isOnEditMode && loading && (
            <svg
              aria-hidden="true"
              className="self-center justify-center inline w-6 h-6 text-light-500 animate-spin fill-blue-600"
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
          )}
          {isOnEditMode && (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>

          )}
        </button>
        {isOnEditMode && (
          <button
            onClick={handleCancelEdit}
            className="rounded self-start bg-red-500 hover:bg-red-700 text-sm text-white py-2 px-4 focus:outline-none focus:shadow-outline"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

          </button>
        )}


        < ConfirmationModal
          title={`are you sure to edit this number?`}
          isOpen={openModal}
          onClose={handleCloseModal}
          onConfirm={handleEdit}
        />
      </div>
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
    </div>
  )

}