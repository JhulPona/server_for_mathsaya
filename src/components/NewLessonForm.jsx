import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlinePlusCircle, AiOutlineClear } from "react-icons/ai";

const NewLessonForm = ({ onSubmit, yunitId }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validationSchema = Yup.object({
    lessonNumber: Yup.number().required("Kinahanglan"),
    lessonName: Yup.string().required("Kinahanglan"),
    lessonDescription: Yup.string().required("Kinahanglan"),
    lessonVideo: Yup.mixed()
      .required("Kinahanglan ang video")
      .test("fileFormat", "Unsupported File Format", (value) => {
        if (value) {
          return ["video/mp4", "video/ogg"].includes(value.type);
        }
        return false;
      }),
    lessonThumbnail: Yup.mixed()
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
      lessonNumber: "",
      lessonName: "",
      lessonDescription: "",
      lessonVideo: null,
      yunitId,
      lessonThumbnail: null,
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
      formik.setFieldValue("lessonThumbnail", null);
      formik.setFieldValue("lessonVideo", null);
      formik.resetForm();
    },
  });

  return (
    <div
      id="bottom-left"
      className="mb-5 mt-auto p-4 border rounded border-black bg-white bg-opacity-60">
      <h2 className="text-xl font-semibold">BAG-ONG LEKSYON</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <input
            type="number"
            {...formik.getFieldProps("lessonNumber")}
            className="w-full p-2 border rounded"
            placeholder="Ikapila nga Leksyon"
          />
          {formik.touched.lessonNumber && formik.errors.lessonNumber && (
            <div className="text-red-600">{formik.errors.lessonNumber}</div>
          )}
        </div>
        <div className="mb-4">
          <input
            type="text"
            {...formik.getFieldProps("lessonName")}
            className="w-full p-2 border rounded"
            placeholder="Pangalan sa Leksyon"
          />
          {formik.touched.lessonName && formik.errors.lessonName && (
            <div className="text-red-600">{formik.errors.lessonName}</div>
          )}
        </div>
        <div className="mb-4">
          <textarea
            {...formik.getFieldProps("lessonDescription")}
            className="w-full p-2 border rounded"
            placeholder="Deskrisyon sa Leksiyon"
          />
          {formik.touched.lessonDescription &&
            formik.errors.lessonDescription && (
              <div className="text-red-600">
                {formik.errors.lessonDescription}
              </div>
            )}
        </div>
        <div className="mb-4">
          <label className="text-sm font-semibold">
            Pakitang piktsur sa leksyon
          </label>
          <input
            type="file"
            onChange={(event) => {
              formik.setFieldValue(
                "lessonThumbnail",
                event.currentTarget.files[0]
              );
            }}
            className="w-full p-2 border rounded"
          />
          {formik.touched.lessonThumbnail && formik.errors.lessonThumbnail && (
            <div className="text-red-600">{formik.errors.lessonThumbnail}</div>
          )}
          {uploading && (
            <div className="mt-2">Uploading: {uploadProgress}%</div>
          )}
        </div>
        <div className="mb-4">
          <label className="text-sm font-semibold">
            Bidyo diskasyon sa leksyon
          </label>
          <input
            type="file"
            onChange={(event) => {
              formik.setFieldValue("lessonVideo", event.currentTarget.files[0]);
            }}
            className="w-full p-2 border rounded"
          />
          {formik.touched.lessonVideo && formik.errors.lessonVideo && (
            <div className="text-red-600">{formik.errors.lessonVideo}</div>
          )}
          {uploading && (
            <div className="mt-2">Uploading: {uploadProgress}%</div>
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
            onClick={() => {
              formik.setFieldValue("lessonThumbnail", null);
              formik.resetForm();
            }}>
            <AiOutlineClear />
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewLessonForm;
