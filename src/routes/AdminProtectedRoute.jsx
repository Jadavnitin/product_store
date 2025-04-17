import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminProtectedRoute = () => {
   const isAdminAuthenticated = useSelector((state) => state.admin.isAdminAuthenticated);

   return isAdminAuthenticated ? <Outlet /> : <Navigate to="/adminsignin" />;
};

export default AdminProtectedRoute;

