

export const ContactFormLoader = () => {

  return (
    <div data-testid='contact-form-loader' className="flex flex-col pt-4 w-full h-full max-w-lg px-4 self-center justify-self-center items-center">
      <span className="mb-4 font-bold text-lg">{'Contact Form'}</span>
      <form className="w-full space-y-4 bg-white shadow-md rounded px-4 pt-6 pb-8 mb-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 w-40 bg-slate-200 rounded"></div>
            <div className="h-10 bg-slate-200 rounded"></div>
          </div>
        </div>

        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 w-40 bg-slate-200 rounded"></div>
            <div className="h-10 bg-slate-200 rounded"></div>
          </div>
        </div>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 w-40 bg-slate-200 rounded"></div>
            <div className="h-10 bg-slate-200 rounded"></div>
          </div>
        </div>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 justify-end space-y-6 py-1">
            <div className="h-8 w-20  bg-slate-200 rounded"></div>
          </div>
        </div>
      </form>
    </div>
  )
}