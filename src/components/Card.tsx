import { PropsWithChildren, useMemo } from 'react';

interface Props {
  className?: string;
}
export const Card = ({ children, className }: PropsWithChildren<Props>) => {
  const cardClassName = useMemo(() => {
    const baseClassName =
      'bg-white border-slate-200 rounded shadow py-4 px-4 flex';
    return [baseClassName, className].filter(Boolean).join(' ');
  }, [className]);

  return <div className={cardClassName}>{children}</div>;
};
