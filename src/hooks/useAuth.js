export const useAuth = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return {
    user,
    isOperator: user?.role === "operador",
    isDoctor: user?.role === "doctor",
  };
};
