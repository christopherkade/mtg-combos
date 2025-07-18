"use client";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-stone-900 border-4 border-yellow-400 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-fade-in">
        <h3 className="text-xl sm:text-2xl font-bold text-yellow-100 mb-4 text-center">
          {title}
        </h3>
        <p className="text-yellow-200 text-center mb-6 sm:mb-8 leading-relaxed">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-stone-50 font-bold rounded-lg transition-colors duration-200 border border-gray-500"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-red-700 hover:bg-red-600 text-stone-50 font-bold rounded-lg transition-colors duration-200 border border-red-500"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
