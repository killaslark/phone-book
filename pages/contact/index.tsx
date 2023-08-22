import { ContactListPageContent } from '@features/contact/components';
import { ContactListProvider } from '@features/contact/contexts';

const ContactListPage = () => {
  return (
    <main className="flex flex-col bg-slate-100 h-max min-h-screen">
      <ContactListProvider>
        <ContactListPageContent />
      </ContactListProvider>
    </main>
  );
};

export default ContactListPage;
