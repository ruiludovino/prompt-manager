import { Route, Routes } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { CommandPalette } from "./components/CommandPalette";
import { Dashboard } from "./pages/Dashboard";
import { Library } from "./pages/Library";
import { Categories } from "./pages/Categories";
import { Tips } from "./pages/Tips";
import { PromptDetail } from "./pages/PromptDetail";
import { PromptEditor } from "./pages/PromptEditor";

function App() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/library" element={<Library />} />
          <Route path="/favorites" element={<Library favoritesOnly />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/prompts/new" element={<PromptEditor />} />
          <Route path="/prompts/:id" element={<PromptDetail />} />
          <Route path="/prompts/:id/edit" element={<PromptEditor />} />
        </Routes>
      </main>
      <CommandPalette />
    </div>
  );
}

export default App;
