import "../App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { SiGoogleclassroom } from "react-icons/si";
import { AiFillPlusSquare, AiFillMinusSquare } from "react-icons/ai";
import Confetti from "react-confetti";

import ModalEditTeacher from "../components/ModalEditTeacher";
import TeacherInfo from "../components/TeacherInfo";
import NewSectionForm from "../components/NewSectionForm";
import NewStudentForm from "../components/NewStudentForm";
import NewYunitForm from "../components/NewYunitForm";
import NewLessonForm from "../components/NewLessonForm";
import NewExerciseForm from "../components/NewExerciseForm";
import SectionList from "../components/SectionList";
import StudentList from "../components/StudentList";
import StudentProfile from "../components/StudentProfile";
import YunitList from "../components/YunitList";
import LessonList from "../components/LessonList";
import ExerciseList from "../components/ExerciseList";
import NewQuestionForm from "../components/NewQuestionForm";
import QuestionList from "../components/QuestionList";
import Dashboard from "../components/Dashboard";

export default function TeacherPortal() {
  const serverUrl = import.meta.env.VITE_REACT_APP_SERVER_URL;

  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;
  const teacher_id = user.id;

  const [showForm, setShowForm] = useState(false);
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [showConfetti, setShowConfetti] = useState(false);

  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [editedTeacher, setEditedTeacher] = useState(null);

  const [teacherInfo, setTeacherInfo] = useState(null);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentLeast, setStudentLeast] = useState(null);
  const [yunits, setYunits] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [studentCount, setStudentCount] = useState([]);
  const [unitCreatedAt, setUnitCreatedAt] = useState([]);
  const [lessonCreatedAt, setLessonCreatedAt] = useState([]);
  const [exerciseCreatedAt, setExerciseCreatedAt] = useState([]);
  const [completedExerInfo, setCompletedExerInfo] = useState([]);
  const [studentProfilesInfo, setStudentProfilesInfo] = useState([]);

  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentProfileId, setStudentProfileId] = useState(null);

  const [selectedYunitId, setSelectedYunitId] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);

  const [searchQueryYunits, setSearchQueryYunits] = useState("");
  const [searchQueryLessons, setSearchQueryLessons] = useState("");
  const [searchQueryExercises, setSearchQueryExercises] = useState("");
  const [searchQueryQuestions, setSearchQueryQuestions] = useState("");
  const [searchQueryStudents, setSearchQueryStudents] = useState("");
  const [searchQuerySections, setSearchQuerySections] = useState("");

  useEffect(() => {
    setShowConfetti(true);

    // You can set a timeout to stop the confetti after a certain duration
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // Adjust the duration as needed

    // Clean up the timer when the component unmounts
    return () => clearTimeout(confettiTimer);
  }, []);

  useEffect(() => {
    if (user) {
      const teacherId = user.id;
      getYunits(teacherId);
      getSection(teacherId);
      getTeacherInfo(teacherId);
      getStudentCount(teacherId);
      getUnitCreatedAt(teacherId);
      getLessonCreatedAt(teacherId);
      getExerciseCreatedAt(teacherId);
      getCompletedExercisesInfo();
      getStudentProfilesInfo(teacherId);
    }
  }, []);

  useEffect(() => {
    if (selectedSectionId) {
      getStudents(selectedSectionId)
        .then((data) => setStudents(data))
        .catch((error) => console.error("Error fetching students:", error));
    }
  }, [selectedSectionId]);

  useEffect(() => {
    if (selectedStudentId) {
      getStudentProfileId(selectedStudentId);
    }
  }, [selectedStudentId]);

  useEffect(() => {
    if (studentProfileId) {
      getStudentLeastRating(studentProfileId)
        .then((data) => setStudentLeast(data))
        .catch((error) =>
          console.error("Error fetching student least rating:", error)
        );
    }
  }, [studentProfileId]);

  useEffect(() => {
    if (selectedYunitId) {
      getLessons(selectedYunitId)
        .then((data) => setLessons(data))
        .catch((error) => console.error("Error fetching lessons:", error));
    }
  }, [selectedYunitId]);

  useEffect(() => {
    if (selectedLessonId) {
      getExercises(selectedLessonId)
        .then((data) => setExercises(data))
        .catch((error) => console.error("Error fetching exercises:", error));
    }
  }, [selectedLessonId]);

  useEffect(() => {
    if (selectedExerciseId) {
      getQuestions(selectedExerciseId)
        .then((data) => setQuestions(data))
        .catch((error) => console.error("Error fetching questions:", error));
    }
  }, [selectedExerciseId]);

  const getTeacherInfo = async (teacherId) => {
    try {
      const response = await axios.get(
        `${serverUrl}/teachers/teacher/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      setTeacherInfo(response.data);
    } catch (error) {
      console.error("Error fetching teacher information:", error);
    }
  };

  const getSection = async (teacherId) => {
    try {
      const response = await axios.get(
        `${serverUrl}/sections/sections/${teacherId}`
      );
      setSections(response.data);
    } catch (error) {
      console.error("Error fetching teacher information:", error);
    }
  };

  const getStudents = async (sectionId) => {
    try {
      const response = await axios.get(
        `${serverUrl}/students/students/${sectionId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const getStudentProfileId = async (studentId) => {
    try {
      const response = await axios.get(
        `${serverUrl}/sprofile/get-student-profile/${studentId}`
      );
      setStudentProfileId(response.data.studentProfileId);
    } catch (error) {
      console.error("Error fetching student profile ID:", error);
    }
  };

  const getStudentLeastRating = async (studentProfileId) => {
    try {
      const response = await axios.get(
        `${serverUrl}/sprofile/min-ratings/${studentProfileId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching student profile:", error);
    }
  };

  const getStudentCount = async (teacherId) => {
    try {
      const response = await axios.get(
        `${serverUrl}/dashboard/student-count/${teacherId}`
      );
      setStudentCount(response.data);
    } catch (error) {
      console.error("Error fetching student count: ", error);
    }
  };

  const getUnitCreatedAt = async (teacherId) => {
    try {
      const response = await axios.get(
        `${serverUrl}/dashboard/unit-created-at/${teacherId}`
      );
      setUnitCreatedAt(response.data);
    } catch (error) {
      console.error("Error fetching yunit info: ", error);
    }
  };

  const getLessonCreatedAt = async (teacherId) => {
    try {
      const response = await axios.get(
        `${serverUrl}/dashboard/lesson-created-at/${teacherId}`
      );
      setLessonCreatedAt(response.data);
    } catch (error) {
      console.error("Error fetching lesson info: ", error);
    }
  };

  const getExerciseCreatedAt = async (teacherId) => {
    try {
      const response = await axios.get(
        `${serverUrl}/dashboard/exercise-created-at/${teacherId}`
      );
      setExerciseCreatedAt(response.data);
    } catch (error) {
      console.error("Error fetching exercise info: ", error);
    }
  };

  const getCompletedExercisesInfo = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/dashboard/completed-exercises-info`
      );
      setCompletedExerInfo(response.data);
    } catch (error) {
      console.error("Error fetching completed exercises info:", error);
    }
  };

  const getStudentProfilesInfo = async (teacherId) => {
    try {
      const response = await axios.get(
        `${serverUrl}/dashboard/student-profiles-info/${teacherId}`
      );
      setStudentProfilesInfo(response.data);
    } catch (error) {
      console.error("Error fetching student profiles info:", error);
    }
  };

  const getYunits = async (teacherId) => {
    try {
      const response = await axios.get(
        `${serverUrl}/yunits/yunits/${teacherId}`
      );
      setYunits(response.data);
    } catch (error) {
      console.error("Error fetching teacher information:", error);
    }
  };

  const getLessons = async (yunitId) => {
    try {
      const response = await axios.get(
        `${serverUrl}/lessons/lessons/${yunitId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching lesson:", error);
    }
  };

  const getExercises = async (lessonId) => {
    try {
      const response = await axios.get(
        `${serverUrl}/exercises/exercises/${lessonId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching exercise:", error);
    }
  };

  const getQuestions = async (exerciseId) => {
    try {
      const response = await axios.get(
        `${serverUrl}/questions/questions/${exerciseId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Teacher Functions START
  const handleEditTeacher = () => {
    setEditedTeacher(teacherInfo);
    setEditModalIsOpen(true);
  };

  const handleEditTeacherSubmit = async (values) => {
    try {
      const response = await axios.put(
        `${serverUrl}/teachers/edit/${teacher_id}`,
        values
      );
      if (response.status === 200) {
        setTeacherInfo(response.data);
        setEditModalIsOpen(false);
      }
    } catch (error) {
      console.error("Error editing teacher:", error);
    }
  };

  const logout = () => {
    Cookies.remove("user");
    Cookies.remove("token");
    window.location.href = "/";
  };

  // Teacher Functions END

  // Section Functions START

  const handleSectionSubmit = async (values) => {
    try {
      const teacherId = user ? user.id : null;
      if (!teacherId) {
        console.error("Teacher ID not found in the user's data.");
        return;
      }
      const sectionData = {
        ...values,
        teacherId,
      };
      const response = await axios.post(
        `${serverUrl}/sections/add`,
        sectionData
      );
      console.log("New section added:", response.data);
      getSection(teacherId);
    } catch (error) {
      console.error("Error adding new section:", error);
      alert(error);
    }
  };

  const handleDeleteSection = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this section?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`${serverUrl}/sections/delete/${id}`);
      getSection(teacher_id);
      setSelectedSectionId(null);
    } catch (e) {
      alert("Cannot delete section that has students!");
    }
  };

  const filteredSections = sections.filter((section) => {
    const { schoolYear, sectionName } = section;
    const searchValue = searchQuerySections.toLowerCase();
    return (
      schoolYear.toLowerCase().includes(searchValue) ||
      sectionName.toLowerCase().includes(searchValue)
    );
  });

  const handleViewSection = async (sectionId) => {
    setActiveComponent("StudentList");
    setSelectedSectionId(sectionId);
  };

  const handleSearchChangeSections = (e) => {
    setSearchQuerySections(e.target.value);
  };

  // Section Functions END

  // Student Functions START

  const handleStudentSubmit = async (values) => {
    try {
      const teacherId = user ? user.id : null;
      if (!teacherId) {
        console.error("Teacher ID not found in the user's data.");
        return;
      }
      const sectionData = {
        ...values,
        teacherId,
      };
      const response = await axios.post(
        `${serverUrl}/students/add`,
        sectionData
      );
      console.log("New student added:", response.data);
      const updatedStudents = await getStudents(selectedSectionId);
      setStudents(updatedStudents);
      getSection(teacher_id);
    } catch (error) {
      console.error("Error adding new student:", error);
      alert(error);
    }
  };

  const handleDeleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this student?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`${serverUrl}/students/delete/${id}`, {});
      const updatedStudents = await getStudents(selectedSectionId);
      setStudents(updatedStudents);
      getSection(teacher_id);
    } catch (e) {
      alert(e);
    }
  };

  const filteredStudents = students.filter((student) => {
    const { firstname, lastname } = student;
    const searchValue = searchQueryStudents.toLowerCase();
    return (
      firstname.toString().toLowerCase().includes(searchValue) ||
      lastname.toString().toLowerCase().includes(searchValue)
    );
  });

  const handleViewStudent = async (studentId) => {
    setActiveComponent("SProfile");
    setSelectedStudentId(studentId);
  };

  const handleSearchChangeStudents = (e) => {
    setSearchQueryStudents(e.target.value);
  };

  // Student Functions END

  // Yunit Functions START

  const handleYunitSubmit = async (values) => {
    try {
      const teacherId = user ? user.id : null;
      if (!teacherId) {
        console.error("Teacher ID not found in the user's data.");
        return;
      }

      const formData = new FormData();
      formData.append("yunitNumber", values.yunitNumber);
      formData.append("yunitName", values.yunitName);
      formData.append("yunitThumbnail", values.yunitThumbnail);
      formData.append("teacherId", teacherId);

      const response = await axios.post(`${serverUrl}/yunits/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("New Yunit added:", response.data);
      getYunits(teacherId);
    } catch (error) {
      console.error("Error adding new Yunit:", error);
      if (error.response && error.response.status === 400) {
        alert("Dili pwede mugamit ug numero sa yunit nga nakalista na!");
      } else {
        alert(error.message);
      }
    }
  };

  const handleDeleteYunit = async (id) => {
    const confirmDelete = window.confirm(
      "Musugot ba ka nga panaon kani nga yunit?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`${serverUrl}/yunits/delete/${id}`, {});
      getYunits(teacher_id);
    } catch (e) {
      alert("Dili pwede panaon ang yunit nga naay sulod!");
    }
  };

  const filteredYunits = yunits.filter((yunit) => {
    const { yunitNumber, yunitName } = yunit;
    const searchValue = searchQueryYunits.toLowerCase();
    return (
      yunitNumber.toString().toLowerCase().includes(searchValue) ||
      yunitName.toString().toLowerCase().includes(searchValue)
    );
  });

  const handleViewYunit = async (yunitId) => {
    setActiveComponent("LessonList");
    setSelectedYunitId(yunitId);
  };

  const handleSearchChangeYunits = (e) => {
    setSearchQueryYunits(e.target.value);
  };

  // Yunit Functions END

  // Lesson Functions START

  const handleLessonSubmit = async (values) => {
    try {
      const teacherId = user ? user.id : null;
      if (!teacherId) {
        console.error("Teacher ID not found in the user's data.");
        return;
      }

      const formData = new FormData();
      formData.append("lessonNumber", values.lessonNumber);
      formData.append("lessonName", values.lessonName);
      formData.append("lessonThumbnail", values.lessonThumbnail);
      formData.append("lessonVideo", values.lessonVideo);
      formData.append("lessonDescription", values.lessonDescription);
      formData.append("yunitId", values.yunitId);
      formData.append("teacherId", teacherId);
      const response = await axios.post(`${serverUrl}/lessons/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("New Lesson added:", response.data);
      const updatedLesson = await getLessons(selectedYunitId);
      setLessons(updatedLesson);
    } catch (error) {
      console.error("Error adding new lessons:", error);
      if (error.response && error.response.status === 400) {
        alert("Dili pwede mugamit ug numero sa lesson nga nakalista na!");
      } else {
        alert(error.message);
      }
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    const confirmDelete = window.confirm(
      "Musugot ba ka nga panaon kani nga leksyon?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`${serverUrl}/lessons/delete/${lessonId}`, {});
      const updatedLesson = await getLessons(selectedYunitId);
      setLessons(updatedLesson);
    } catch (e) {
      alert("Dili pwede panaon ang leksyon nga naay sulod!");
    }
  };

  const filteredLessons = lessons.filter((lesson) => {
    const { lessonNumber, lessonName } = lesson;
    const searchValue = searchQueryLessons.toLowerCase();
    return (
      lessonNumber.toString().toLowerCase().includes(searchValue) ||
      lessonName.toString().toLowerCase().includes(searchValue)
    );
  });

  const handleViewLesson = async (lessonId) => {
    setActiveComponent("ExerciseList");
    setSelectedLessonId(lessonId);
  };

  const handleSearchChangeLessons = (e) => {
    setSearchQueryLessons(e.target.value);
  };

  // Lesson Functions END

  // Exercise Functions START

  const handleExerciseSubmit = async (values) => {
    try {
      const teacherId = user ? user.id : null;
      if (!teacherId) {
        console.error("Teacher ID not found in the user's data.");
        return;
      }
      const sectionData = {
        ...values,
        teacherId,
      };
      const response = await axios.post(
        `${serverUrl}/exercises/add`,
        sectionData
      );
      console.log("New exercise added:", response.data);
      const updatedExercises = await getExercises(selectedLessonId);
      setExercises(updatedExercises);
    } catch (error) {
      console.error("Error adding new exercise:", error);
      if (error.response && error.response.status === 400) {
        alert("Dili pwede mugamit ug numero sa yunit nga nakalista na!");
      } else {
        alert(error.message);
      }
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    const confirmDelete = window.confirm(
      "Musugot ba ka nga panaon kani nga ehersisyo?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`${serverUrl}/exercises/delete/${exerciseId}`, {});
      const updatedExercises = await getExercises(selectedLessonId);
      setExercises(updatedExercises);
    } catch (e) {
      alert("Dili pwede panaon ang ehersisyo nga naay sulod!");
    }
  };

  const filteredExercises = exercises.filter((exercise) => {
    const { exercise_number, exercise_name } = exercise;
    const searchValue = searchQueryExercises.toLowerCase();
    return (
      exercise_number.toString().toLowerCase().includes(searchValue) ||
      exercise_name.toString().toLowerCase().includes(searchValue)
    );
  });

  const handleViewExercise = async (exerciseId) => {
    setActiveComponent("QuestionList");
    setSelectedExerciseId(exerciseId);
  };

  const handleSearchChangeExercise = (e) => {
    setSearchQueryExercises(e.target.value);
  };

  // Exercise Functions END

  // Question Function START

  const handleQuestionSubmit = async (values) => {
    console.log(values);
    try {
      const formData = new FormData();
      formData.append("question_text", values.question_text);
      formData.append("questionImage", values.questionImage);

      // Append each answer choice individually
      values.answer_choices.forEach((choice, index) => {
        formData.append(`answer_choices[${index}]`, choice);
      });

      formData.append("correct_answer", values.correct_answer);
      formData.append("exerciseId", values.exerciseId);

      const response = await axios.post(`${serverUrl}/questions/add`, formData);
      console.log("New question added:", response.data);
      const updatedQuestions = await getQuestions(selectedExerciseId);
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error("Error adding new question:", error);
      alert(error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    const confirmDelete = window.confirm(
      "Musugot ba ka nga panaon kani nga tubagonon?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`${serverUrl}/questions/delete/${questionId}`, {});
      const updatedQuestions = await getQuestions(selectedExerciseId);
      setQuestions(updatedQuestions);
    } catch (e) {
      alert("Dili pwede panaon ang tubagonon nga naay sulod!");
    }
  };

  const filteredQuestions = questions.filter((question) => {
    const { question_text, correct_answer } = question;
    const searchValue = searchQueryQuestions.toLowerCase();
    return (
      question_text.toString().toLowerCase().includes(searchValue) ||
      correct_answer.toString().toLowerCase().includes(searchValue)
    );
  });

  const handleSearchChangeQuestion = (e) => {
    setSearchQueryQuestions(e.target.value);
  };

  // Question Function END

  // Others START

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  // Others END

  return (
    <div className="flex flex-col md:flex-row  bg-gradient-to-tr from-tertiary to-primary md:min-h-screen ">
      {showConfetti && <Confetti />}

      <div className="md:w-1/4 p-4 border rounded border-black bg-white bg-opacity-60 md:mr-4 md:mb-0 mb-4">
        {user && (
          <TeacherInfo
            teacherInfo={teacherInfo}
            logout={logout}
            handleEditTeacher={handleEditTeacher}
          />
        )}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveComponent("Dashboard")}
              className={`${
                activeComponent === "Dashboard"
                  ? "bg-pink text-white"
                  : "bg-secondary"
              } px-4 py-2 rounded hover:shadow-lg hover:shadow-pink hover:text-white text-xs w-full  transition duration-300 ease-in-out transform hover:scale-105 `}>
              <div className="flex flex-row items-center justify-center">
                <span className="p-1">
                  <SiGoogleclassroom />
                </span>
                <span>Dashburd</span>
              </div>
            </button>
            <button
              onClick={() => setActiveComponent("SectionList")}
              className={`${
                activeComponent === "SectionList" ||
                activeComponent === "StudentList" ||
                activeComponent === "SProfile"
                  ? "bg-pink text-white"
                  : "bg-secondary"
              } px-4 py-2 rounded hover:shadow-lg hover:shadow-pink hover:text-white text-xs w-full transition duration-300 ease-in-out transform hover:scale-105`}>
              <div className="flex flex-row items-center justify-center">
                <span className="p-1">
                  <SiGoogleclassroom />
                </span>
                <span> Tolonghaan</span>
              </div>
            </button>
            <button
              onClick={() => setActiveComponent("YunitList")}
              className={`${
                activeComponent === "YunitList" ||
                activeComponent === "LessonList" ||
                activeComponent === "ExerciseList" ||
                activeComponent === "QuestionList"
                  ? "bg-pink text-white"
                  : "bg-secondary"
              } px-4 py-2 rounded hover:shadow-lg hover:shadow-pink hover:text-white text-xs w-full transition duration-300 ease-in-out transform hover:scale-105`}>
              <div className="flex flex-row items-center justify-center">
                <span className="p-1">
                  <SiGoogleclassroom />
                </span>
                <span>Hilisgutan</span>
              </div>
            </button>
          </div>
          <div className="flex flex-row justify-end pt-2 pb-2">
            <button
              type="button"
              onClick={toggleForm}
              className="flex flex-row rounded hover:shadow-lg hover:shadow-primary text-4xl justify-center transition duration-300 ease-in-out transform hover:scale-105">
              {showForm ? (
                <AiFillMinusSquare className="text-primary" />
              ) : (
                <AiFillPlusSquare className="text-primary" />
              )}
            </button>
          </div>
        </div>

        {showForm && (
          <>
            {activeComponent === "SectionList" && (
              <>
                <NewSectionForm onSubmit={handleSectionSubmit} />
              </>
            )}
            {activeComponent === "StudentList" && (
              <>
                <NewStudentForm
                  onSubmit={handleStudentSubmit}
                  sectionId={selectedSectionId}
                />
              </>
            )}
            {activeComponent === "YunitList" && (
              <>
                <NewYunitForm onSubmit={handleYunitSubmit} />
              </>
            )}
            {activeComponent === "LessonList" && (
              <>
                <NewLessonForm
                  onSubmit={handleLessonSubmit}
                  yunitId={selectedYunitId}
                />
              </>
            )}

            {activeComponent === "ExerciseList" && (
              <>
                <NewExerciseForm
                  onSubmit={handleExerciseSubmit}
                  lessonId={selectedLessonId}
                />
              </>
            )}

            {activeComponent === "QuestionList" && (
              <>
                <NewQuestionForm
                  onSubmit={handleQuestionSubmit}
                  exerciseId={selectedExerciseId}
                />
              </>
            )}
          </>
        )}
      </div>
      <div className="md:w-3/4 p-4 border rounded border-black bg-white bg-opacity-60">
        <div style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
          {activeComponent === "Dashboard" && (
            <>
              <Dashboard
                studentCount={studentCount}
                unitCreatedAt={unitCreatedAt}
                lessonCreatedAt={lessonCreatedAt}
                exerciseCreatedAt={exerciseCreatedAt}
                completedExerInfo={completedExerInfo}
                studentProfilesInfo={studentProfilesInfo}
              />
            </>
          )}
          {activeComponent === "SectionList" && (
            <>
              <div
                id="screen-point"
                className="flex flex-row mb-4 space-x-4 justify-start p-1">
                <button
                  onClick={() => setActiveComponent("SectionList")}
                  className="rounded-rectangle text-white text-center">
                  Seksyon
                </button>
              </div>
              <SectionList
                sections={filteredSections}
                handleDeleteSection={handleDeleteSection}
                handleSearchChangeSections={handleSearchChangeSections}
                searchQuerySections={searchQuerySections}
                filteredSections={filteredSections}
                handleView={handleViewSection}
                setActiveComponent={setActiveComponent}
              />
            </>
          )}
          {activeComponent === "StudentList" && (
            <>
              <div
                id="screen-point"
                className="flex flex-row mb-4 space-x-4 justify-start p-1">
                <button
                  onClick={() => setActiveComponent("SectionList")}
                  className="rounded-rectangle text-white text-center ">
                  Seksyon
                </button>
                <button
                  onClick={() => setActiveComponent("StudentList")}
                  className="rounded-rectangle text-white text-center">
                  Estudyante
                </button>
              </div>
              <StudentList
                selectedSectionId={selectedSectionId}
                students={filteredStudents}
                handleDeleteStudent={handleDeleteStudent}
                handleSearchChangeStudents={handleSearchChangeStudents}
                searchQueryStudents={searchQueryStudents}
                filteredStudents={filteredStudents}
                handleView={handleViewStudent}
                setActiveComponent={setActiveComponent}
              />
            </>
          )}
          {activeComponent === "SProfile" && (
            <>
              <div
                id="screen-point"
                className="flex flex-row mb-4 space-x-4 justify-start p-1">
                <button
                  onClick={() => setActiveComponent("SectionList")}
                  className="rounded-rectangle text-white text-center ">
                  Seksyon
                </button>
                <button
                  onClick={() => setActiveComponent("StudentList")}
                  className="rounded-rectangle text-white text-center">
                  Estudyante
                </button>
                <button
                  onClick={() => setActiveComponent("SProfile")}
                  className="rounded-rectangle text-white text-center">
                  Profayl
                </button>
              </div>
              <StudentProfile
                studentProfileId={studentProfileId}
                studentLeast={studentLeast}
              />
            </>
          )}
          {activeComponent === "YunitList" && (
            <>
              <div
                id="screen-point"
                className="flex flex-row mb-4 space-x-4 justify-start p-1">
                <button
                  onClick={() => setActiveComponent("YunitList")}
                  className="rounded-rectangle text-white text-center">
                  Yunits
                </button>
              </div>
              <YunitList
                yunits={filteredYunits}
                handleDeleteYunit={handleDeleteYunit}
                handleSearchChangeYunits={handleSearchChangeYunits}
                searchQueryYunits={searchQueryYunits}
                filteredYunits={filteredYunits}
                handleView={handleViewYunit}
                setActiveComponent={setActiveComponent}
                serverUrl={serverUrl}
              />
            </>
          )}
          {activeComponent === "LessonList" && (
            <>
              <div
                id="screen-point"
                className="flex flex-row mb-4 space-x-4 justify-start p-1">
                <button
                  onClick={() => setActiveComponent("YunitList")}
                  className="rounded-rectangle text-white text-center">
                  Yunits
                </button>
                <button
                  onClick={() => setActiveComponent("LessonList")}
                  className="rounded-rectangle text-white text-center">
                  Lessons
                </button>
              </div>
              <LessonList
                selectedYunitId={selectedYunitId}
                lessons={filteredLessons}
                handleDeleteLesson={handleDeleteLesson}
                handleSearchChangeLessons={handleSearchChangeLessons}
                searchQueryLessons={searchQueryLessons}
                filteredLessons={filteredLessons}
                handleView={handleViewLesson}
                setActiveComponent={setActiveComponent}
                serverUrl={serverUrl}
              />
            </>
          )}
          {activeComponent === "ExerciseList" && (
            <>
              <div
                id="screen-point"
                className="flex flex-row mb-4 space-x-4 justify-start p-1">
                <button
                  onClick={() => setActiveComponent("YunitList")}
                  className="rounded-rectangle text-white text-center">
                  Yunits
                </button>
                <button
                  onClick={() => setActiveComponent("LessonList")}
                  className="rounded-rectangle text-white text-center">
                  Lessons
                </button>
                <button
                  onClick={() => setActiveComponent("ExerciseList")}
                  className="rounded-rectangle text-white text-center">
                  Exercises
                </button>
              </div>
              <ExerciseList
                selectedLessonId={selectedLessonId}
                exercises={filteredExercises}
                handleDeleteExercise={handleDeleteExercise}
                handleSearchChangeExercise={handleSearchChangeExercise}
                searchQueryExercises={searchQueryExercises}
                filteredExercises={filteredExercises}
                handleView={handleViewExercise}
                setActiveComponent={setActiveComponent}
              />
            </>
          )}
          {activeComponent === "QuestionList" && (
            <>
              <div
                id="screen-point"
                className="flex flex-row mb-4 space-x-4 justify-start p-1">
                <button
                  onClick={() => setActiveComponent("YunitList")}
                  className="rounded-rectangle text-white text-center">
                  Yunits
                </button>
                <button
                  onClick={() => setActiveComponent("LessonList")}
                  className="rounded-rectangle text-white text-center">
                  Lessons
                </button>
                <button
                  onClick={() => setActiveComponent("ExerciseList")}
                  className="rounded-rectangle text-white text-center">
                  Exercises
                </button>
                <button
                  onClick={() => setActiveComponent("QuestionList")}
                  className="rounded-rectangle text-white text-center">
                  Questions
                </button>
              </div>
              <QuestionList
                selectedExerciseId={selectedExerciseId}
                questions={filteredQuestions}
                handleDeleteQuestion={handleDeleteQuestion}
                handleSearchChangeQuestion={handleSearchChangeQuestion}
                searchQueryQuestions={searchQueryQuestions}
                filteredQuestions={filteredQuestions}
                setActiveComponent={setActiveComponent}
                serverUrl={serverUrl}
              />
            </>
          )}
        </div>
      </div>
      {editedTeacher && (
        <ModalEditTeacher
          isOpen={editModalIsOpen}
          onRequestClose={() => {
            setEditModalIsOpen(false);
            setEditedTeacher(null);
          }}
          initialValues={editedTeacher}
          onSubmit={handleEditTeacherSubmit}
        />
      )}
    </div>
  );
}
