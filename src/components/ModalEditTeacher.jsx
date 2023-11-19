import React from "react";
import Modal from "react-modal";
import { useFormik } from "formik";
import * as Yup from "yup";

const ModalEditTeacher = ({
  isOpen,
  onRequestClose,
  initialValues,
  onSubmit,
}) => {
  const validationSchema = Yup.object({
    firstname: Yup.string().required("Kinahanglan"),
    lastname: Yup.string().required("Kinahanglan"),
    gender: Yup.string().required("Kinahanglan"),
    email: Yup.string().email("Dili mao nga email").required("Kinahanglan"),
    password: Yup.string().required("Kinahanglan"),
  });

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
      onRequestClose();
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Modal for editing teacher information"
      className="modal bg-white rounded shadow-lg"
      overlayClassName="overlay fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="p-8 bg-white rounded shadow-lg">
        <h2 className="font-bold">USBA ANG IMONG IMPORMASYON</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              {...formik.getFieldProps("firstname")}
              className="w-full p-2 border rounded"
              placeholder="Pangalan"
            />
            {formik.touched.firstname && formik.errors.firstname && (
              <div className="text-red-600">{formik.errors.firstname}</div>
            )}
          </div>
          <div className="mb-4">
            <input
              type="text"
              {...formik.getFieldProps("lastname")}
              className="w-full p-2 border rounded"
              placeholder="Apilyedo"
            />
            {formik.touched.lastname && formik.errors.lastname && (
              <div className="text-red-600">{formik.errors.lastname}</div>
            )}
          </div>
          <div className="mb-4">
            <select
              {...formik.getFieldProps("gender")}
              className="w-full p-2 border rounded">
              <option value="" disabled>
                Kinatawo
              </option>
              <option value="Lalaki">Lalaki</option>
              <option value="Babae">Babae</option>
            </select>
            {formik.touched.gender && formik.errors.gender && (
              <div className="text-red-600">{formik.errors.gender}</div>
            )}
          </div>
          <div className="mb-4">
            <input
              type="email"
              {...formik.getFieldProps("email")}
              className="w-full p-2 border rounded"
              placeholder="Email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-600">{formik.errors.email}</div>
            )}
          </div>
          <div className="mb-4">
            <input
              type="password"
              {...formik.getFieldProps("password")}
              className="w-full p-2 border rounded"
              placeholder="Isulat ang daan o bag-on nga password"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-600">{formik.errors.password}</div>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            Isumite ang mga Pagbag-o
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalEditTeacher;
