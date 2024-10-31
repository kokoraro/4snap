import { toast } from "react-hot-toast";

export default class CustomToast {
  duration: number;
  constructor() {
    this.duration = 400;
  }

  public success(
    title: string,
    msg: string,
    align?: "center" | "left",
    darkmode?: false,
    rounded?: boolean
  ) {
    toast.custom((t) => (
      <ToastContent
        title={title}
        msg={msg}
        type="success"
        align={align}
        darkmode={darkmode}
        rounded={rounded}
        t={t}
      />
    ));
  }

  public warning(
    title: string,
    msg: string,
    align?: "center" | "left",
    darkmode?: false,
    rounded?: boolean
  ) {
    toast.custom((t) => (
      <ToastContent
        title={title}
        msg={msg}
        type="warning"
        align={align}
        darkmode={darkmode}
        rounded={rounded}
        t={t}
      />
    ));
  }

  public error(
    title: string,
    msg: string,
    align?: "center" | "left",
    darkmode?: false,
    rounded?: boolean
  ) {
    toast.custom((t) => (
      <ToastContent
        title={title}
        msg={msg}
        type="error"
        align={align}
        darkmode={darkmode}
        rounded={rounded}
        t={t}
      />
    ));
  }
}

interface ToastContProp {
  rounded?: boolean;
  darkmode?: boolean;
  title?: string;
  msg?: string;
  align?: "center" | "left";
  type: "error" | "success" | "warning";
  t: any;
}

function ToastContent({
  align,
  rounded,
  darkmode,
  title,
  msg,
  type,
  t,
}: ToastContProp) {
  const alignStyles =
    align === "center"
      ? `items-center justify-center text-center`
      : `items-start justify-start`;
  const roundedStyles = rounded ? "rounded-[30px]" : "rounded-md";
  const darkmodeStyles = darkmode
    ? "bg-dark-200 text-white-100"
    : "bg-white-100 text-dark-100";

  const icon = type === "error" ? "❌" : type === "warning" ? "⚠️" : "✅";

  return (
    <div
      className={`max-w-[150px] w-[100px] shadow-lg pointer-events-auto flex flex-col p-3 ring-1 ring-black ring-opacity-5 ${darkmodeStyles} ${alignStyles} ${roundedStyles}`}
    >
      <div
        className={`${
          t?.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">{icon}</div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">Emilia Gates</p>
              <p className="mt-1 text-sm text-gray-500">
                Sure! 8:30pm works great!
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          {/* <button
        onClick={() => toast.dismiss(t.id)}
        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Close
      </button> */}
        </div>
      </div>
    </div>
  );
}
