import { useState } from "react";
import { login } from "../utils/api";
import Input from "../components/Input";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await login(form.username, form.password);
      onLogin(data.token);
    } catch {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-10">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-700 tracking-wide">
          Budget Tracker Login
        </h1>
        {error && (
          <div className="mb-4 text-center text-red-600 font-semibold">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            type="text"
          />
          <Input
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-semibold py-3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
