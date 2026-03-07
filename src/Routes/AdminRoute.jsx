import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  const decoded = jwtDecode(token);

  const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (role !== "admin") {
    return <Navigate to="/home" />;
  }

  return children;
};

export default AdminRoute;