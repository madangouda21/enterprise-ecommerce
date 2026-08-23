import api from "./api";

const userService = {
    getProfile: async () => {
        const response = await api.get("/api/v1/users/profile");
        return response.data;
    },

    updateProfile: async (data) => {
        const response = await api.put("/api/v1/users/profile", data);
        return response.data;
    },

    getAllUsers: async () => {
        const response = await api.get("/api/v1/users");
        return response.data;
    },

    getUserById: async (id) => {
        const response = await api.get(`/api/v1/users/${id}`);
        return response.data;
    },

    updateUser: async (id, data) => {
        const response = await api.put(`/api/v1/users/${id}`, data);
        return response.data;
    },

    deleteUser: async (id) => {
        await api.delete(`/api/v1/users/${id}`);
        return true;
    }
};

export default userService;
