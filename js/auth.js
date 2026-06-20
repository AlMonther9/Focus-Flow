// auth.js

const AUTH_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "https://focusflow.runasp.net/api/auth"
    : "/api/auth";

const auth = {
    async register(username, email, password) {
        try {
            const response = await fetch(`${AUTH_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });
            if (!response.ok) {
                let errorMsg = "Registration failed";
                try {
                    const data = await response.json();
                    errorMsg = data.error || errorMsg;
                } catch (e) {}
                throw new Error(errorMsg);
            }
            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false, error: err.message };
        }
    },
    async login(email, password) {
        try {
            const response = await fetch(`${AUTH_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            if (!response.ok) {
                let errorMsg = "Login failed";
                try {
                    const data = await response.json();
                    errorMsg = data.error || errorMsg;
                } catch (e) {}
                throw new Error(errorMsg);
            }
            
            const data = await response.text(); 
            try {
                const json = JSON.parse(data);
                if (json.token) {
                    localStorage.setItem("auth_token", json.token);
                    if (json.username) {
                        localStorage.setItem("auth_username", json.username);
                    }
                }
            } catch (e) {
                // If it's a simple 200 OK without JSON, we assume session is managed by cookies
            }
            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false, error: err.message };
        }
    },
    logout() {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_username");
        window.location.reload();
    },
    getToken() {
        return localStorage.getItem("auth_token");
    },
    getUsername() {
        return localStorage.getItem("auth_username") || "User";
    }
};
