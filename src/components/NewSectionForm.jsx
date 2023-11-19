import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlinePlusCircle, AiOutlineClear } from "react-icons/ai";

const NewSectionForm = ({ onSubmit }) => {
  const validationSchema = Yup.object({
    schoolYear: Yup.string()
      .required("Kinahanglan")
      .matches(
        /^\d{4}-\d{4}$/,
        "Ang Tuig sa Pagtungha kinahanglan nagsunod sa porma 'YYYY-YYYY'"
      ),
    sectionName: Yup.string().required("Kinahanglan"),
  });

  const formik = useFormik({
    initialValues: {
      schoolYear: "",
      sectionName: "",
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
      <h2 className="text-xl font-semibold">BAG-ONG SEKSYON</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4 ">
          <input
            type="text"
            {...formik.getFieldProps("schoolYear")}
            className="w-full p-2 border rounded "
            placeholder="Tuig sa Pagtungha (e.g. 2021-2022)"
          />
          {formik.touched.schoolYear && formik.errors.schoolYear && (
            <div className="text-red-600">{formik.errors.schoolYear}</div>
          )}
        </div>
        <div className="mb-4">
          <input
            type="text"
            {...formik.getFieldProps("sectionName")}
            className="w-full p-2 border rounded"
            placeholder="Pangalan sa Seksyon"
          />
          {formik.touched.sectionName && formik.errors.sectionName && (
            <div className="text-red-600">{formik.errors.sectionName}</div>
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

export default NewSectionForm;
