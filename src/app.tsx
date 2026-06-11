import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import Nav from "./components/Nav";
import { Separator } from "./components/ui/separator";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Router
      root={props => (
        <>
          <Suspense>
            <Nav></Nav>

            <div class="min-h-[calc(100vh-5em)] relative flex-1 flex flex-col bg-background text-foreground font-sans">
              <div class="relative">
                <div class="pointer-events-none fixed inset-0 z-2 overflow-hidden">
                  <div class="absolute inset-0 animate-[stripes_30s_linear_infinite]"
                    style="background: repeating-linear-gradient(
      105deg,
      transparent 0px,
      transparent 120px,
      rgba(from var(--color-ctp-base) r g b / 0.25) 120px,
      rgba(from var(--color-ctp-base) r g b / 0.25) 240px
    ); background-size: 200% 100%;"
                  />
                </div>

                {props.children}
              </div>
            </div>


            <div class="relative z-3 bottom-0">
              <Separator />

              <Footer></Footer>
            </div>
          </Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
