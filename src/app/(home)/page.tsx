import { Home } from "@/modules/home";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}
