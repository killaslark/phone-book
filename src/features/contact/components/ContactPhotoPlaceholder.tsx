import Image from "next/image";

interface Props {
  first_name: string;
  last_name?: string;
}
export const ContactPhotoPlaceholder = ({ first_name, last_name }: Props) => {
  const name = [first_name, last_name].filter(Boolean).join(' ');

  return (
    <Image
      width={40}
      height={40}
      className="h-10 w-10 rounded-full"
      src={`https://ui-avatars.com/api/?background=random&name=${name}`}
      alt=""
    />
  );
};
