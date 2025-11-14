import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { fetchBudget, createOrUpdateBudget } from "../utils/api";
import Input from "../components/Input";

export default function Budget({ token }) {
  const { data, error, mutate } = useSWR(["/budget/", token], ([url, tok]) => fetchBudget(tok));
  const [budget, setBudget] = useState({ month: "", amount: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (data) {
      setBudget({ month: data.month || "", amount: data.amount || "" });
    }
  }, [data]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await createOrUpdateBudget(budget, token);
      setMessage("Budget saved successfully");
      mutate();
    } catch {
      setMessage("Failed to save budget");
    }
  }

  function handleChange(e) {
    setBudget({ ...budget, [e.target.name]: e.target.value });
  }

  if (error) return <div>Error loading budget</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Budget Management</h1>
      {message && <p className="mb-4">{message}</p>}
      <form onSubmit={handleSubmit}>
        <Input label="Month (YYYY-MM)" name="month" value={budget.month} onChange={handleChange} />
        <Input label="Amount" name="amount" value={budget.amount} onChange={handleChange} type="number" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Save Budget</button>
      </form>
      {/* You can add visualization with D3.js here to compare budget with expenses */}
    </div>
  );
}
