import { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";

export default function RegisteredUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7148/api/User/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      console.log("Fetched users:", data);

      // Ensure users is always an array
      setUsers(Array.isArray(data) ? data : [data]);

    } catch (error) {
      console.error(error);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7148/api/User/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete user");
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error(error);
      alert("Failed to delete user");
    }
  };

  if (loading)
    return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="registered-users p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Registered Users</h2>

      {users.length === 0 ? (
        <div className="text-gray-500 text-center py-10">No users found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col justify-between p-4 bg-white rounded-2xl shadow hover:shadow-lg transition"
            >
              <div>
                <p className="font-semibold text-gray-800 text-lg break-words">{user.username}</p>
                <p className="text-gray-500 text-sm break-words">{user.email}</p>
              </div>

              <button
                onClick={() => deleteUser(user.id)}
                className="mt-3 flex items-center justify-center gap-2 px-3 py-1 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition shadow"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}