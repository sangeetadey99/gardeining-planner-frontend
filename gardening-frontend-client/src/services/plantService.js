import API from "./api";

export const deletePlant = (id) => {
  return API.delete(`/plants/${id}`);
};

export const updatePlant = (id, updatedData) => {
  return API.put(`/plants/${id}`, updatedData);
};
