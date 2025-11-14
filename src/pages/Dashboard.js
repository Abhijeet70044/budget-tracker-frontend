import { useEffect, useRef } from "react";
import useSWR from "swr";
import { fetcher } from "../utils/api";
import * as d3 from "d3";

function BudgetExpenseChart({ budget, expenses }) {
  const ref = useRef();

  useEffect(() => {
    if (budget == null && expenses == null) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const data = [
      { name: "Budget", value: Number(budget) || 0 },
      { name: "Expenses", value: Number(expenses) || 0 },
    ];

    const width = 400;
    const height = 200;
    const margin = { top: 20, right: 30, bottom: 40, left: 70 };

    svg.attr("width", width).attr("height", height);

    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) * 1.1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("font-size", "14px")
      .attr("font-weight", "bold");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `₹${d.toFixed(2)}`))
      .selectAll("text")
      .attr("font-size", "12px");

    svg.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.name))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.value))
      .attr("height", d => y(0) - y(d.value))
      .attr("fill", d => (d.name === "Budget" ? "#2563eb" : "#ef4444"))
      .attr("rx", 4)
      .attr("ry", 4);

    svg.selectAll(".label")
      .data(data)
      .join("text")
      .attr("class", "label")
      .attr("x", d => x(d.name) + x.bandwidth() / 2)
      .attr("y", d => y(d.value) - 8)
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", 14)
      .text(d => `₹${d.value.toFixed(2)}`);
  }, [budget, expenses]);

  return <svg ref={ref} />;
}

export default function Dashboard({ token }) {
  const { data: summaryData, error: summaryError } = useSWR(
    [`/summary/`, token],
    ([url, token]) => fetcher(url, token)
  );

  const { data: budgetData, error: budgetError } = useSWR(
    [`/budget/`, token],
    ([url, token]) => fetcher(url, token)
  );

  if (summaryError || budgetError)
    return <div className="text-red-600 text-center mt-10">Error loading data</div>;
  if (!summaryData || !budgetData)
    return <div className="text-center mt-10">Loading...</div>;

  // Use Number conversion and fallback 0 for safe toFixed formatting
  const income = Number(summaryData.income) || 0;
  const expenses = Number(summaryData.expenses) || 0;
  const balance = Number(summaryData.balance) || 0;
  const budgetAmount = Number(budgetData.amount) || 0;

  const stats = [
    { label: "Income", value: income, color: "text-green-600" },
    { label: "Expenses", value: expenses, color: "text-red-600" },
    { label: "Balance", value: balance, color: "text-blue-600" },
    { label: "Budget", value: budgetAmount, color: "text-purple-600" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="border rounded-lg p-4 shadow-sm bg-white">
            <p className={`text-lg font-semibold ${color}`}>{label}</p>
            <p className="mt-2 text-2xl font-bold">{`₹${value.toFixed(2)}`}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
          Budget vs Expenses
        </h2>
        {budgetAmount !== null ? (
          <BudgetExpenseChart budget={budgetAmount} expenses={expenses} />
        ) : (
          <p className="text-center text-gray-500">No budget set for this month</p>
        )}
      </section>
    </div>
  );
}
