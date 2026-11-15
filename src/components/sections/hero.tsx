import Image from "next/image";
import { sammy } from "@/config/sammy";
import { sammyImages } from "@/data/sammy-images";
import { sammyImage } from "@/lib/assets";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { RotatingRole } from "./rotating-role";
import styles from "./hero.module.scss";

export function Hero() {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <div className="site-container">
        <div className={styles.grid}>
          <div className={styles.portrait}>
            <p className={styles.backText} aria-hidden="true">
              {sammy.roles[0]}
            </p>
            <Reveal variant="zoom" className={styles.portraitReveal}>
              <Image
                src={sammyImage(sammyImages.hero.path)}
                width={sammyImages.hero.width}
                height={sammyImages.hero.height}
                alt={sammyImages.hero.alt}
                preload
                unoptimized
                sizes="(max-width: 575px) 260px, 486px"
                className={styles.portraitImage}
              />
            </Reveal>
            <p className={styles.frontText} aria-hidden="true">
              {sammy.roles[0]}
            </p>
          </div>
          <div className={styles.introduction}>
            <Reveal>
              <p className={styles.greeting}>Hello</p>
            </Reveal>
            <Reveal order={2}>
              <h1 className={styles.title}>
                i’m {sammy.name}
                <br />
                <RotatingRole />
              </h1>
            </Reveal>
            <Reveal order={3}>
              <p className={styles.description}>{sammy.introduction}</p>
            </Reveal>
            <Reveal order={4} className={styles.action}>
              <ButtonLink href="/projects">View Portfolio</ButtonLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
