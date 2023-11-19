import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlinePlusCircle, AiOutlineClear } from "react-icons/ai";

const NewExerciseForm = ({ onSubmit, lessonId, selectedLessonId }) => {
  const validationSchema = Yup.object({
    exercise_number: Yup.number().required("Kinahanglan"),
    exercise_name: Yup.string().required("Kinahanglan"),
    exercise_description: Yup.string().required("Kinahanglan"),
  });

  const formik = useFormik({
    initialValues: {
      exercise_number: "",
      exercise_name: "",
      exercise_description: "",
      lessonId,
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
      <h2 className="text-xl font-semibold">BAG-ONG EHERSISYO</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <input
            type="number"
            {...formik.getFieldProps("exercise_number")}
            className="w-full p-2 border rounded"
            placeholder="Ikapila nga ehersisyo"
          />
          {formik.touched.exercise_number && formik.errors.exercise_number && (
            <div className="text-red-600">{formik.errors.exercise_number}</div>
          )}
        </div>
        <div className="mb-4">
          <input
            type="text"
            {...formik.getFieldProps("exercise_name")}
            className="w-full p-2 border rounded"
            placeholder="Pangalan sa ehersisyo"
          />
          {formik.touched.exercise_name && formik.errors.exercise_name && (
            <div className="text-red-600">{formik.errors.exercise_name}</div>
          )}
        </div>
        <div className="mb-4">
          <textarea
            {...formik.getFieldProps("exercise_description")}
            className="w-full p-2 border rounded"
            placeholder="Deskripsyon sa ehersisyo"
          />
          {formik.touched.exercise_description &&
            formik.errors.exercise_description && (
              <div className="text-red-600">
                {formik.errors.exercise_description}
              </div>
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

export default NewExerciseForm;
