import { useState } from "react";
import useSWR from "swr";
import { fetcher, createTransaction } from "../utils/api";
import Input from "../components/Input";

function TransactionList({ token }) {
  const { data, error } = useSWR(["/transactions/", token], ([url, token]) =>
    fetcher(url, token)
  );

  if (error) return <div className="text-red-600 p-4">Error loading transactions</div>;
  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Transactions</h2>
      <ul className="space-y-3 max-h-96 overflow-auto">
        {data.map((txn) => (
          <li
            key={txn.id}
            className="border p-3 rounded shadow-sm flex justify-between items-center hover:shadow-md transition"
          >
            <div>
              <p className="font-semibold capitalize">{txn.type}</p>
              <p className="text-gray-600 text-sm">{txn.description || "-"}</p>
            </div>
            <div className={`font-bold text-xl ${txn.type === "income" ? "text-green-600" : "text-red-600"}`}>
              ₹{Number(txn.amount).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Transactions({ token }) {
  const [form, setForm] = useState({ amount: "", type: "income", description: "" });
  const [error, setError] = useState("");
  const { mutate } = useSWR(["/transactions/", token], ([url, token]) =>
    fetcher(url, token)
  );

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await createTransaction(form, token);
      setForm({ amount: "", type: "income", description: "" });
      mutate(); // Refresh list
    } catch {
      setError("Failed to add transaction");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Add Transaction</h1>
      {error && <p className="text-red-600 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow-lg">
        <Input label="Amount" name="amount" value={form.amount} onChange={handleChange} type="number" />
        <label className="block font-semibold">
          Type:
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="ml-3 border rounded px-3 py-2 focus:ring focus:ring-indigo-500 focus:outline-none"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <Input label="Description" name="description" value={form.description} onChange={handleChange} />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded transition"
        >
          Add Transaction
        </button>
      </form>

      <TransactionList token={token} />
    </div>
  );
}
