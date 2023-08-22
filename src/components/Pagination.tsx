interface Props {
  currentPage: number;
  disabledNext?: boolean;
  disabledPrevious?: boolean;
  onPressNext?: () => void;
  onPressPrevious?: () => void;
}
export const Pagination = ({
  currentPage,
  disabledNext,
  disabledPrevious,
  onPressNext,
  onPressPrevious,
}: Props) => {
  if (disabledNext && disabledPrevious) return null;

  return (
    <div className="flex flex-col items-center">
      <span>Current Page: {currentPage}</span>
      <div className="inline-flex mt-2 xs:mt-0">
        <button
          disabled={disabledPrevious}
          onClick={onPressPrevious}
          className="
            flex items-center justify-center px-3 h-8 text-sm font-medium 
            text-white bg-gray-800 rounded-l 
            hover:bg-gray-900 dark:bg-gray-800 
            dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white 
            disabled:opacity-50
          "
        >
          <svg
            className="w-3.5 h-3.5 mr-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 5H1m0 0 4 4M1 5l4-4"
            />
          </svg>
          {'Prev'}
        </button>

        <button
          disabled={disabledNext}
          onClick={onPressNext}
          className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
        >
          {'Next'}
          <svg
            className="w-3.5 h-3.5 ml-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
