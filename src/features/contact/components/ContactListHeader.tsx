import React from 'react';

import Link from 'next/link';

import { useContactListProvider } from '../contexts';

export const ContactListHeader = () => {
  const { onChangeSearchKeyword } = useContactListProvider();

  return (
    <div className="px-4 pt-4 space-y-4">
      <span data-testid='contact-list-header' className="font-bold"> {'Contact List Page: '}</span>
      <div className="flex flex-row justify-end">
        <Link passHref href="/contact/form">
          <button className="bg-blue-500 text-xs font-medium flex flex-row rounded-full hover:bg-blue-700 text-white py-2 px-4">
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
            {'New Contact'}
          </button>
        </Link>
      </div>

      <div className="max-w-md">
        <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
          <div className="grid place-items-center h-full w-12 text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            data-testid='contact-list-search-input'
            onChange={e => onChangeSearchKeyword(e.target.value)}
            className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
            type="text"
            id="search"
            placeholder="Search by first name or phone number"
          />
        </div>
      </div>
    </div>
  );
};
