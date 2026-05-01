import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Layout from "./components/layout/Layout";
import ErrorBoundary from "./components/ErrorBoundary";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Market = lazy(() => import("./pages/Market"));
const Advisory = lazy(() => import("./pages/Advisory"));
const SavedRecords = lazy(() => import("./pages/SavedRecords"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-stone-400 font-medium">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
              <Route path="/market" element={<Suspense fallback={<PageLoader />}><Market /></Suspense>} />
              <Route path="/advisory" element={<Suspense fallback={<PageLoader />}><Advisory /></Suspense>} />
              <Route path="/saved" element={<Suspense fallback={<PageLoader />}><SavedRecords /></Suspense>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  );
}
