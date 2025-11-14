export default function Input({ label, type = "text", value, onChange, name }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold" htmlFor={name}>
        {label}
      </label>
      <input
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
