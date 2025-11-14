import { NavLink, useNavigate } from "react-router-dom";

export default function NavBar({ onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate("/"); // redirect to login which shows if no token
  }

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex space-x-8">
        {['dashboard', 'transactions', 'budget'].map((path) => (
          <NavLink
            key={path}
            to={`/${path}`}
            className={({ isActive }) =>
              `relative px-3 py-2 font-semibold hover:text-indigo-400 transition-colors
              ${isActive ? "text-indigo-400" : "text-gray-300"}`
            }
          >
            {path.charAt(0).toUpperCase() + path.slice(1)}
            {/** Active link underline effect */}
            {({ isActive }) =>
              isActive ? (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-400 rounded animate-fadeIn" />
              ) : null
            }
          </NavLink>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none text-white px-4 py-2 rounded-md transition"
      >
        Logout
      </button>
    </nav>
  );
}
