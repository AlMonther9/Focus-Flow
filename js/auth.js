// auth.js

const AUTH_URL = "https://focusflow.runasp.net/api/auth";

const auth = {
    async register(username, email, password) {
        try {
            const response = await fetch(`${AUTH_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });
            if (!response.ok) throw new Error("Registration failed");
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    },
    async login(email, password) {
        try {
            const response = await fetch(`${AUTH_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            if (!response.ok) throw new Error("Login failed");
            
            const data = await response.text(); 
            try {
                const json = JSON.parse(data);
                if (json.token) {
                    localStorage.setItem("auth_token", json.token);
                }
            } catch (e) {
                // If it's a simple 200 OK without JSON, we assume session is managed by cookies
            }
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    },
    logout() {
        localStorage.removeItem("auth_token");
        window.location.reload();
    },
    getToken() {
        return localStorage.getItem("auth_token");
    }
};
