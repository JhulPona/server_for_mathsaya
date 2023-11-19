import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlinePlusCircle, AiOutlineClear } from "react-icons/ai";

const NewStudentForm = ({ onSubmit, sectionId, selectedSectionId }) => {
  const validationSchema = Yup.object({
    firstname: Yup.string().required("Kinahanglan"),
    lastname: Yup.string().required("Kinahanglan"),
    username: Yup.string().required("Kinahanglan"),
    gender: Yup.string().required("Kinahanglan"),
  });

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      username: "",
      gender: "",
      sectionId,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
    },
  });

  return (
    <div
      id="bottom-left"
      className="mb-5 mt-auto p-4 border rounded border-black bg-white bg-opacity-60">
      <h2 className="text-xl font-semibold">BAGO-ONG ESTUDYANTE</h2>
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
          <input
            type="text"
            {...formik.getFieldProps("username")}
            className="w-full p-2 border rounded"
            placeholder="Angga"
          />
          {formik.touched.username && formik.errors.username && (
            <div className="text-red-600">{formik.errors.username}</div>
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
        <div className="space-x-2 flex text-2xl mt-4 justify-end">
          <button
            type="submit"
            className="bg-gray-300 hover:text-black p-2 rounded hover:bg-primary text-2xl"
            disabled={!formik.isValid}>
            <AiOutlinePlusCircle />
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:text-black p-2 rounded hover:bg-primary text-2xl"
            onClick={() => formik.resetForm()}>
            <AiOutlineClear />
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewStudentForm;
