import { Toaster, type ToasterProps } from "sonner";
import SearchBar from "./components/SearchBar";
import Layout from "./Layout";
import { useTheme } from "./components/theme-provider";

function App() {
  const { theme } = useTheme();
  return (
    <Layout>
      <SearchBar />
      <Toaster
        position="bottom-right"
        richColors
        theme={theme as ToasterProps["theme"]}
      />
    </Layout>
  );
}

export default App;
