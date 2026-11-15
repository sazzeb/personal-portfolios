import Link from "next/link";
import { BrainCircuit, Cloud, Code2, Server } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { services } from "@/data/services";
import type { ServiceIcon } from "@/types/portfolio";
import { Reveal } from "@/components/ui/reveal";
import styles from "./service-grid.module.scss";

const serviceIcons = {
  ai: BrainCircuit,
  fullStack: Code2,
  backend: Server,
  cloud: Cloud,
} satisfies Record<ServiceIcon, LucideIcon>;

export function ServiceGrid() {
  return (
    <section className="section-space-both" aria-label="Services">
      <div className="site-container">
        <div className={styles.grid}>
          {services.map((service, index) => {
            const Icon = serviceIcons[service.icon];
            return (
              <Reveal key={service.slug} order={index + 1}>
                <Link
                  href={`/services/${service.slug}`}
                  className={styles.card}
                >
                  <Icon className={styles.icon} size={55} strokeWidth={1.25} />
                  <h2>{service.title}</h2>
                  <p>{service.technologies}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
