import { User, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstant from "../../lib/axios";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstant.get("/users/me");
        if (res.status === 200) {
          setUser(res.data.data.email);
        }
      } catch (error) {
        console.error("User fetch failed:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axiosInstant.post(
        "/auth/logout",
        {},
        { withCredentials: true }
      );
      console.log("Logout Response:", res);
      setUser("");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="w-full backdrop-blur-md bg-white/70 shadow-md sticky top-0 z-50 px-8 py-4 flex items-center justify-between border-b border-gray-200">
      <button
        className="text-xl font-semibold text-gray-800 hover:text-black transition"
        onClick={() => navigate("/")}
      >
        Task OF Me
      </button>

      {user ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 font-medium text-gray-700 hover:text-black transition"
            data-cy="dropdown-logout-button"
            aria-label="dropdown-logout-button"
          >
            <User size={23} />
            <span>{user}</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                data-cy="logout-button"
                aria-label="logout-button"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          className="bg-black text-white px-6 py-2 rounded-[10px] shadow-md hover:bg-gray-900 transition font-medium flex items-center gap-2"
          onClick={() => navigate("/login")}
          data-cy="login-button"
          aria-label="login-button"
        >
          <User size={23} /> Login
        </button>
      )}
    </nav>
  );
}

export default Navbar;
