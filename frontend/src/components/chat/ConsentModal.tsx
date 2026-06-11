interface Props {
    open: boolean;
    onAccept: () => void;
    onClose: () => void;
  }
  
  export default function ConsentModal({
    open,
    onAccept,
    onClose,
  }: Props) {
    if (!open) {
      return null;
    }
  
    return (
      <>
        <div
          className="
          fixed
          inset-0
          bg-black/50
          z-[9998]
          "
        />
  
        <div
          className="
          fixed
          inset-0
          flex
          items-center
          justify-center
          z-[9999]
          p-4
          "
        >
          <div
            className="
            bg-white
            rounded-3xl
            p-8
            max-w-lg
            w-full
            shadow-xl
            "
          >
            <h2
              className="
              text-2xl
              font-bold
              mb-4
              "
            >
              AI Sustainability Assistant
            </h2>
  
            <p
              className="
              text-slate-600
              mb-4
              "
            >
              This assistant uses AI to
              answer sustainability and
              environmental questions.
            </p>
  
            <ul
              className="
              text-sm
              text-slate-600
              space-y-2
              mb-6
              "
            >
              <li>
                • Chat history is stored
              </li>
  
              <li>
                • 25 messages per day
              </li>
  
              <li>
                • Last 100 messages retained
              </li>
  
              <li>
                • You can clear history anytime
              </li>
            </ul>
  
            <div
              className="
              flex
              justify-end
              gap-3
              "
            >
              <button
                onClick={onClose}
                className="
                px-4
                py-2
                rounded-xl
                border
                "
              >
                Not Now
              </button>
  
              <button
                onClick={onAccept}
                className="
                px-4
                py-2
                rounded-xl
                bg-green-600
                text-white
                "
              >
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }