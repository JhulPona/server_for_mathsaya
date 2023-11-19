import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlinePlusCircle, AiOutlineClear } from "react-icons/ai";

const NewYunitForm = ({ onSubmit }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validationSchema = Yup.object({
    yunitNumber: Yup.number().required("Kinahanglan").positive("Kinahanglan"),
    yunitName: Yup.string().required("Kinahanglan"),
    yunitThumbnail: Yup.mixed()
      .required("Kinahanglan ang picture")
      .test("fileFormat", "Unsupported File Format", (value) => {
        if (value) {
          return ["image/jpeg", "image/png"].includes(value.type);
        }
        return false;
      }),
  });

  const formik = useFormik({
    initialValues: {
      yunitNumber: "",
      yunitName: "",
      yunitThumbnail: null,
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
      formik.setFieldValue("yunitThumbnail", null);
      formik.resetForm();
    },
  });

  return (
    <div className="mb-5 mt-auto p-4 border rounded border-black bg-white bg-opacity-60">
      <h2 className="text-xl font-semibold pb-2">BAG-ONG YUNIT</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <input
            type="number"
            {...formik.getFieldProps("yunitNumber")}
            className="w-full p-2 border rounded"
            placeholder="Ikapila nga Yunit"
          />
          {formik.touched.yunitNumber && formik.errors.yunitNumber && (
            <div className="text-red-600">{formik.errors.yunitNumber}</div>
          )}
        </div>
        <div className="mb-4">
          <input
            type="text"
            {...formik.getFieldProps("yunitName")}
            className="w-full p-2 border rounded"
            placeholder="Pangalan sa Yunit"
          />
          {formik.touched.yunitName && formik.errors.yunitName && (
            <div className="text-red-600">{formik.errors.yunitName}</div>
          )}
        </div>
        <div className="mb-4">
          <input
            type="file"
            onChange={(event) => {
              formik.setFieldValue(
                "yunitThumbnail",
                event.currentTarget.files[0]
              );
            }}
            className="w-full p-2 border rounded"
          />
          {formik.touched.yunitThumbnail && formik.errors.yunitThumbnail && (
            <div className="text-red-600">{formik.errors.yunitThumbnail}</div>
          )}
          {uploading && (
            <div className="mt-2">Uploading: {uploadProgress}%</div>
          )}
        </div>
        <div className="space-x-2 flex text-2xl mt-4 justify-end">
          <button
            type="submit"
            className="bg-gray-300 hover:text-black p-2 rounded hover-bg-primary text-2xl"
            disabled={!formik.isValid}>
            <AiOutlinePlusCircle />
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:text-black p-2 rounded hover-bg-primary text-2xl"
            onClick={() => {
              formik.setFieldValue("yunitThumbnail", null);
              formik.resetForm();
            }}>
            <AiOutlineClear />
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewYunitForm;
