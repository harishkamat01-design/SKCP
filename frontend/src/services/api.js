const API_BASE_URL = "http://localhost:8080";

const apiRequest = async (endpoint, options = {}) => {
    const token = sessionStorage.getItem("skcp_token");

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",

            ...(token
                ? {
                      Authorization: `Bearer ${token}`,
                  }
                : {}),

            ...(options.headers || {}),
        },
    });

    let result = null;

    try {
        result = await response.json();
    } catch {
        result = null;
    }

    if (!response.ok) {
        throw new Error(
            result?.message || `API request failed (${response.status})`
        );
    }

    return result;
};

export const apiGet = (endpoint) => {
    return apiRequest(endpoint, {
        method: "GET",
    });
};

export const apiPost = (endpoint, data) => {
    return apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const apiPut = (endpoint, data) => {
    return apiRequest(endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
    });
};

export const apiDelete = (endpoint) => {
    return apiRequest(endpoint, {
        method: "DELETE",
    });
};