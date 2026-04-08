import AllRoutes from "./Routes/AllRoutes.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      <AllRoutes />
    </>
  );
}

export default App;
