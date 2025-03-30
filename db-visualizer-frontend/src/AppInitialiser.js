import "./App.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setDbInfo } from "./store/dbSlice";
import { apiGet } from "./services/apiClient";

function AppInitialiser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadActiveDb = async () => {
      const activeDb = await fetchActiveDbInfo();
      if (activeDb) {
        dispatch(setDbInfo(activeDb));
      }
    };

    loadActiveDb();
  }, [dispatch]);
  const fetchActiveDbInfo = async () => {
    try {
      const res = await apiGet("/connections/active");
      fetchMeta(res?.data?.data?.id);
    } catch (err) {
      console.error("Failed to fetch active DB", err);
      return null;
    }
  };
  const fetchMeta = async (id) => {
    if (id) {
      try {
        const res = await apiGet(`/connections/${id}/meta`);
        console.log({ res: res.data });
        dispatch(setDbInfo(res.data));
      } catch (err) {
        console.error("Error loading DB info", err);
      }
    }
  };

  return null;
}

export default AppInitialiser;
