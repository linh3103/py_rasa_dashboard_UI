// src/lib/api.ts

const BASE_URL = "http://127.0.0.1:8000";

function getAuthToken(): string | null {
  // Lấy token từ localStorage/sessionStorage hoặc nơi khác
  return localStorage.getItem('token');
}

function buildHeaders(customHeaders?: HeadersInit): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options.headers),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }

  return res.json();
}

// Public API

export function get<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

export function post<T>(path: string, data: any): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function put<T>(path: string, data: any): Promise<T> {
  return request<T>(path, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function del<T>(path: string): Promise<T> {
  return request<T>(path, {
    method: 'DELETE',
  });
}
