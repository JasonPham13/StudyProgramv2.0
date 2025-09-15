import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const getSubjects = () => axios.get(`${API_URL}/subjects`);
export const createSubject = (data) => axios.post(`${API_URL}/subjects`, data);
export const deleteSubject = (id) => axios.delete(`${API_URL}/subjects/${id}`);
