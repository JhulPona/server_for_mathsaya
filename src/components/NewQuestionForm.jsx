import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlinePlusCircle, AiOutlineClear } from "react-icons/ai";
import { BsCalendar2Plus, BsCalendar2Minus } from "react-icons/bs";

const NewQuestionForm = ({ onSubmit, exerciseId }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validationSchema = Yup.object({
    question_text: Yup.string().required("Kinahanglan"),
    answer_choices: Yup.array()
      .of(Yup.string())
      .min(2, "Kinahanglan ug duha o sobra pa na mga tubag")
      .required("Kinahanglan"),
    correct_answer: Yup.string()
      .test(
        "match-answer",
        "Kinahanglan naa ang saktong answer sa pilianan ug tubag",
        function (value) {
          return this.parent.answer_choices.includes(value);
        }
      )
      .required("Kinahanglan"),
    questionImage: Yup.mixed().test(
      "fileFormat",
      "Unsupported File Format",
      (value) => {
        if (value) {
          return ["image/jpeg", "image/png"].includes(value.type);
        }
        return false;
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      question_text: "",
      answer_choices: [""],
      correct_answer: "",
      exerciseId,
      questionImage: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setUploading(true);
      setUploadProgress(0);

      // Simulate an upload delay (replace this with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSubmit(values);
      setUploading(false);
      setUploadProgress(0);
      formik.setFieldValue("questionImage", null);
      formik.resetForm();
    },
  });

  const handleAddAnswerChoice = () => {
    formik.values.answer_choices.push("");
    formik.setFieldValue("answer_choices", formik.values.answer_choices);
  };

  const handleRemoveAnswerChoice = () => {
    if (formik.values.answer_choices.length > 1) {
      formik.values.answer_choices.pop();
      formik.setFieldValue("answer_choices", formik.values.answer_choices);
    }
  };

  return (
    <div
      id="bottom-left"
      className="mb-5 mt-auto p-4 border rounded border-black bg-white bg-opacity-60">
      <h2 className="text-xl font-semibold">BAG-ONG TUBAGONON</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            {...formik.getFieldProps("question_text")}
            className="w-full p-2 border rounded"
            placeholder="Pangutana"
          />
          {formik.touched.question_text && formik.errors.question_text && (
            <div className="text-red-600">{formik.errors.question_text}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="text-sm font-semibold">Piktsur sa pangutana</label>
          <input
            type="file"
            onChange={async (event) => {
              formik.setFieldValue(
                "questionImage",
                event.currentTarget.files[0]
              );
            }}
            className="w-full p-2 border rounded"
            disabled={uploading}
          />
          {formik.touched.questionImage && formik.errors.questionImage && (
            <div className="text-red-600">{formik.errors.questionImage}</div>
          )}
          {uploading && (
            <div className="mt-2">Uploading: {uploadProgress}%</div>
          )}
        </div>
        <div className="mb-4 flex flex-col">
          <p className="font-semibold">Pilianan sa answer:</p>
          {formik.values.answer_choices.map((choice, index) => (
            <div key={index} className=" mb-2">
              <input
                type="text"
                {...formik.getFieldProps(`answer_choices[${index}]`)}
                className="w-full p-2 border rounded"
                placeholder={`Ika${index + 1} nga tubag pilianan`}
              />
              {formik.touched.answer_choices &&
                formik.touched.answer_choices[index] &&
                formik.errors.answer_choices &&
                formik.errors.answer_choices[index] && (
                  <div className="text-red-600">
                    {formik.errors.answer_choices[index]}
                  </div>
                )}
            </div>
          ))}
          <div className="space-x-2 flex text-2xl mt-4 justify-end">
            <button
              type="button"
              className="bg-blue-300 text-white p-2 rounded text-2xl hover:bg-blue-400"
              onClick={handleAddAnswerChoice}>
              <BsCalendar2Plus />
            </button>
            <button
              type="button"
              className="bg-red-300 text-white p-2 rounded text-2xl hover:bg-red-400"
              onClick={handleRemoveAnswerChoice}>
              <BsCalendar2Minus />
            </button>
          </div>
        </div>
        <div className="mb-4">
          <input
            type="text"
            {...formik.getFieldProps("correct_answer")}
            className="w-full p-2 border rounded"
            placeholder="Saktong tubag"
          />
          {formik.touched.correct_answer && formik.errors.correct_answer && (
            <div className="text-red-600">{formik.errors.correct_answer}</div>
          )}
        </div>
        <div className="space-x-2 flex text-2xl mt-4 justify-end">
          <button
            type="submit"
            className="bg-gray-300 hover:text-black p-2 rounded hover:bg-primary text-2xl"
            disabled={!formik.isValid || uploading}>
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

export default NewQuestionForm;
