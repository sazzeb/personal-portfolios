import Image from "next/image";
import type { Testimonial } from "@/types/portfolio";
import { sammyImage } from "@/lib/assets";
import styles from "@/components/sections/testimonials.module.scss";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className={styles.card}>
      <div className={styles.content}>
        <p className={styles.statement} data-highlight-statement>
          {testimonial.quote}
        </p>
        <figcaption>
          <h2>{testimonial.name}</h2>
          <p>{testimonial.role}</p>
        </figcaption>
        <Image
          src={sammyImage("testimonial/testimonial-icon.svg")}
          width={110}
          height={94}
          alt=""
          className={styles.quoteIcon}
        />
      </div>
      <Image
        src={sammyImage(testimonial.image)}
        width={315}
        height={360}
        unoptimized
        alt=""
        className={styles.portrait}
        sizes="(max-width: 799px) 40vw, 25vw"
      />
    </figure>
  );
}
