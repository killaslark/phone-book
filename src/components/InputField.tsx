import { HTMLProps } from 'react';

interface Props extends HTMLProps<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
}
export const InputField = ({
  className,
  errorMessage,
  label,
  ...props
}: Props) => {
  const baseLabelClassName = 'block text-gray-700 text-sm font-bold mb-2';
  const errorLabelClassName = 'text-red-400';
  const labelClassName = [
    baseLabelClassName,
    errorMessage ? errorLabelClassName : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  const baseInputClassName =
    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline';
  const errorInputClassName = 'border-red-400';
  const inputClassName = [
    baseInputClassName,
    errorMessage ? errorInputClassName : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="flex flex-col grow">
      {!!label && <label className={labelClassName}>{label}</label>}
      <input {...props} className={inputClassName} />
      {!!errorMessage && (
        <span className="text-xs mt-1 text-red-500">{errorMessage}</span>
      )}
    </div>
  );
};
