import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const fetchCollections = () => axios.get(`${API_BASE}/collections`);
export const fetchCollectionData = (name) =>
  axios.get(`${API_BASE}/collection/${name}`);
