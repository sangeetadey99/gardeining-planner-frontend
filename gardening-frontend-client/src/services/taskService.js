import API from "./api";

export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const updateTask = (id) => API.put(`/tasks/${id}`);