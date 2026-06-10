import { Navigate } from "react-router-dom";
import { getUserKey } from "../../services/localStorage";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: Props) {
  const userKey = getUserKey();

  if (!userKey) {
    return <Navigate to="/register" replace />;
  }

  return <>{children}</>;
}