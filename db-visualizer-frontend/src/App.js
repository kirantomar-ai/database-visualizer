import "./App.css";
import AppLayout from "../src/layouts/AppLayout";
import AppRoutes from "./routes/AppRoutes";
import AppInitialiser from "./AppInitialiser";

function App() {
  return (
    <>
      <AppInitialiser />
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </>
  );
}

export default App;
