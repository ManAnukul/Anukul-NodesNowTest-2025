import { Dialog } from "@headlessui/react";
import ConfirmDeleteModalProps from "../../Types/ConfirmDeleteModalProps";

function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm"
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
        <Dialog.Title className="text-lg font-semibold mb-4">
          Delete Task
        </Dialog.Title>
        <p className="mb-4 text-gray-700">
          Are you sure you want to delete this task?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-[20px] hover:bg-blue-700 w-[5rem]"
          >
            Delete
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default ConfirmDeleteModal;
