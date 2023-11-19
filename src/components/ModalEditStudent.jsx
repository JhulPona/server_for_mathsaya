import Modal from "react-modal";
import { useFormik } from "formik";
import * as Yup from "yup";

const ModalEditStudent = ({
  isOpen,
  onRequestClose,
  initialValues,
  onSubmit,
  sectionIds,
}) => {
  const validationSchema = Yup.object({
    roomID: Yup.string().required("Room ID is required"),
    firstname: Yup.string().required("First Name is required"),
    lastname: Yup.string().required("Last Name is required"),
    gender: Yup.string().required("Gender is required"),
    username: Yup.string().required("Username is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
      onRequestClose();
    },
  });

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Modal for editing student information"
        className="modal bg-white rounded shadow-lg"
        overlayClassName="overlay fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="p-8 bg-white rounded shadow-lg">
          <h2>Edit Student</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <select
                {...formik.getFieldProps("roomID")}
                className="w-full p-2 border rounded ">
                <option value="" disabled>
                  Section ID
                </option>
                {sectionIds.map((sectionId) => (
                  <option key={sectionId} value={sectionId} disabled>
                    {sectionId}
                  </option>
                ))}
              </select>
              {formik.touched.roomId && formik.errors.roomID && (
                <div className="text-red-600">{formik.errors.roomID}</div>
              )}
            </div>
            <div className="mb-4">
              <input
                type="text"
                {...formik.getFieldProps("firstname")}
                className="w-full p-2 border rounded"
                placeholder="First Name"
              />
              {formik.touched.firstName && formik.errors.firstname && (
                <div className="text-red-600">{formik.errors.firstName}</div>
              )}
            </div>
            <div className="mb-4">
              <input
                type="text"
                {...formik.getFieldProps("lastname")}
                className="w-full p-2 border rounded"
                placeholder="Last Name"
              />
              {formik.touched.lastName && formik.errors.lastname && (
                <div className="text-red-600">{formik.errors.lastname}</div>
              )}
            </div>
            <div className="mb-4">
              <select
                {...formik.getFieldProps("gender")}
                className="w-full p-2 border rounded">
                <option value="" disabled>
                  Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <div className="text-red-600">{formik.errors.gender}</div>
              )}
            </div>
            <div className="mb-4">
              <input
                type="text"
                {...formik.getFieldProps("username")}
                className="w-full p-2 border rounded"
                placeholder="Username"
              />
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-600">{formik.errors.username}</div>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
              Save Changes
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default ModalEditStudent;
