export interface AuthUser {
  id: number;
  username: string;
  password: string;
  name: string;
  phone: string;
  balance: number;
  role: string;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

export function getStoredUser(): AuthUser | null {
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(userStr);

    if (!parsed || typeof parsed !== "object") {
      localStorage.removeItem("user");
      return null;
    }

    const raw = parsed as Record<string, unknown>;
    const id = toNumber(raw.id);
    const balance = toNumber(raw.balance);

    if (id === null) {
      localStorage.removeItem("user");
      return null;
    }

    return {
      id,
      username: typeof raw.username === "string" ? raw.username : "",
      password: typeof raw.password === "string" ? raw.password : "",
      name: typeof raw.name === "string" ? raw.name : "User",
      phone: typeof raw.phone === "string" ? raw.phone : "",
      balance: balance ?? 0,
      role: typeof raw.role === "string" ? raw.role : "customer",
    };
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}
