import { api } from "./axios";

export const getCartByUserApi = (id) =>
  api.get("/carts", { params: { userId: id } });

export const postCartItemApi = (param) => api.post("/carts", param);

export const putCartItemApi = (id, param) => api.put(`/carts/${id}`, param);

export const deleteCartItemApi = (id) => api.delete(`/carts/${id}`);
