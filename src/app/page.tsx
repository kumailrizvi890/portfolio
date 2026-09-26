import { Hero } from "@/components/sections/hero";
import { WorkGrid } from "@/components/sections/work-grid";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <WorkGrid />
      <Skills />
      <Experience />
      <Contact />
    </>
  );
}
