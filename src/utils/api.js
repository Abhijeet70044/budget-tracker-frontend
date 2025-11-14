const BASE_URL = "https://web-production-84535.up.railway.app/api";

async function login(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return await res.json();
}

async function fetcher(url, token) {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { Authorization: `Token ${token}` },
  });
  if (!res.ok) throw new Error("Fetching failed");
  return await res.json();
}

async function createTransaction(data, token) {
  const res = await fetch(`${BASE_URL}/transactions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create transaction");
  return await res.json();
}

async function fetchBudget(token) {
  const res = await fetch(`${BASE_URL}/budget/`, {
    headers: { Authorization: `Token ${token}` },
  });
  if (!res.ok) throw new Error("Fetching budget failed");
  return await res.json();
}

async function createOrUpdateBudget(data, token) {
  const res = await fetch(`${BASE_URL}/budget/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create/update budget");
  return await res.json();
}

export { login, fetcher, createTransaction, fetchBudget, createOrUpdateBudget };
