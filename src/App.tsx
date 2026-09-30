import { resolvePage } from "./pages";

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  return resolvePage(path);
}
