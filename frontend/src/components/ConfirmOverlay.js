import { Overlay } from "./Overlay"

export const ConfirmOverlay = ({isOpen, onClose, onConfirm, titleText="", confirmText="Yes", cancelText="Cancel", children}) => {
    return <Overlay isOpen={isOpen} onClose={onClose}>
        <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl shadow-xl w-[90%] max-w-sm border border-slate-700 text-[1.8vh]">
          <h2 className="text-[2vh] font-semibold mb-2">{titleText}</h2>

          <p className="text-slate-300 mb-6">
            {children}
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={onClose}
              className="redGradientButton px-4 py-2 rounded-lg  transition"
            >
              {cancelText}
            </button>

            <button
              onClick={onConfirm}
              className="gradientButton px-4 py-2 rounded-lg transition"
            >
              {confirmText}
            </button>
          </div>
        </div>
    </Overlay>
}