import {
  BrainCircuit,
  Cloud,
  Code2,
  Container,
  Database,
  Layers,
  Network,
  Terminal,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import styles from "./client-logos.module.scss";

const technologies = [
  { name: "Python", icon: Terminal },
  { name: "PyTorch", icon: BrainCircuit },
  { name: "Scikit-learn", icon: Network },
  { name: "Next.js", icon: Code2 },
  { name: "Django", icon: Layers },
  { name: "PostgreSQL", icon: Database },
  { name: "AWS", icon: Cloud },
  { name: "Docker", icon: Container },
] as const;

export function ClientLogos() {
  return (
    <section className="section-space" aria-label="Engineering technologies">
      <div className="site-container">
        <SectionHeading eyebrow="Technology Stack">
          Tools Behind My Work
        </SectionHeading>
        <Reveal className={styles.grid}>
          {technologies.map(({ name, icon: Icon }) => (
            <div className={styles.logo} key={name}>
              <Icon size={34} aria-hidden="true" />
              <span>{name}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
