import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import Nav from "./components/Nav";

export default function App() {
  return (
    <Router
      root={props => (
        <>
          <Suspense>
            <div class="absolute z-3 top-0 left-0 right-0">
              <Nav></Nav>
            </div>
            {props.children}
          </Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
