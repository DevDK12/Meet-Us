import { useEffect } from "react";
import "./src/global.css";
import Navigation from "./src/navigation/Navigation";
import { requestPermissions } from "./src/utils/Helpers";

const App = () => {

  useEffect(() => {
    const fetchPermissions = async () => {
      await requestPermissions();
    }
    fetchPermissions();
  }, [])


  return (
    <Navigation />
  )
}
export default App