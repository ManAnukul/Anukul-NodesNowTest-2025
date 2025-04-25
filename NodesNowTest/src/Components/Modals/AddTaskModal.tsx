import { Dialog } from "@headlessui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AddTaskModalProps from "../../Types/AddTaskModalProps";


const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(5, "Description must be at least 5 characters"),
});

function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const newTask = { ...values, status: "pending" };
      onAdd(newTask);
      onClose();
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm"
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <Dialog.Title className="text-xl font-bold mb-4">
          Add New Task
        </Dialog.Title>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="w-full border rounded p-2 mb-3"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
            />
            {formik.submitCount > 0 && formik.errors.title && (
              <div className="text-red-500">{formik.errors.title}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="w-full border rounded p-2 mb-3"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
            />
            {formik.submitCount > 0 && formik.errors.description && (
              <div className="text-red-500">{formik.errors.description}</div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 rounded "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-[20px] hover:bg-blue-700 w-[5rem]"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}

export default AddTaskModal;
