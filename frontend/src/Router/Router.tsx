import { Route, Routes } from "react-router-dom";
import LoginPage from "../Page/LoginPage/LoginPage";
import RegisterPage from "../Page/RegisterPage/Register";
import TasksManagementPage from "../Page/TasksManagementPage/TasksManagementPage";

function Router() {
  return (
    <>
      <Routes>
        <Route path="/" element={<TasksManagementPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default Router;
