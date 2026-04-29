import { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

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

      const data = await response.json();

      setUsers(
        data.map((u) => ({
          id: u.userId,
          username: u.username,
          email: u.email,
          profileImage: u.profileImage,
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = (userId) => {
    toast(
      ({ closeToast }) => (
        <div className="w-[260px] text-center">
          <div className="text-2xl mb-2">⚠️</div>

          <p className="text-sm text-gray-700 mb-4">
            Do you really want to delete this user?
          </p>

          <div className="flex justify-center gap-3">

            {/* CANCEL */}
            <button
              onClick={closeToast}
              className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>

            {/* DELETE */}
            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");

                  await fetch(
                    `https://localhost:7148/api/User/${userId}`,
                    {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );

                  setUsers((prev) =>
                    prev.filter((u) => u.id !== userId)
                  );

                  toast.success("User deleted successfully!");
                } catch (error) {
                  console.error(error);
                  toast.error("Delete failed ❌");
                }

                closeToast();
              }}
              className="px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm"
            >
              Delete
            </button>

          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="p-4 bg-gray-50 h-full overflow-y-auto">

      <h2 className="text-2xl font-bold mb-6 text-pink-500">
        Registered Users
      </h2>

      {users.length === 0 ? (
        <p className="text-center text-gray-500">No users found</p>
      ) : (
        <div className="space-y-4">

          {users.map((user) => (
            <div
              key={user.id}
              className="
                flex flex-col sm:flex-row 
                sm:items-center sm:justify-between
                gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition
              "
            >

              {/* USER INFO */}
              <div className="flex items-center gap-3">

                <img
                  src={user.profileImage || "/profileImage.png"}
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate">
                    {user.username}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>

              </div>

              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteUser(user.id)}
                className="
                  w-full sm:w-auto
                  flex items-center justify-center gap-2
                  px-4 py-2 bg-rose-500 text-white text-sm
                  rounded-lg hover:bg-rose-600 transition
                "
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