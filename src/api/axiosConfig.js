import jwtDecode from "jwt-decode";

const [role, setRole] = useState(null);

useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    const decoded = jwtDecode(token);
    setRole(decoded.role);
  }
}, []);