import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    
    // Create localized error message based on status code
    let localizedError = '';
    switch (res.status) {
      case 400:
        localizedError = 'errorBadRequest';
        break;
      case 401:
        localizedError = 'errorUnauthorized';
        break;
      case 404:
        localizedError = 'errorNotFound';
        break;
      case 500:
        localizedError = 'errorServerError';
        break;
      default:
        localizedError = 'errorGeneric';
    }
    
    const error = new Error(`${res.status}: ${text}`);
    error.localizedKey = localizedError;
    error.statusCode = res.status;
    throw error;
  }
}

export async function apiRequest(url, options = {}) {
  const res = await fetch(url, {
    headers: options.body ? { "Content-Type": "application/json" } : {},
    credentials: "include",
    ...options,
  });

  await throwIfResNotOk(res);
  return res;
}

export const getQueryFn = ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/"), {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
