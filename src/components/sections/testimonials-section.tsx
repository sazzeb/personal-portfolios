import { Suspense } from "react";
import { testimonials } from "@/data/portfolio";
import { TestimonialCard } from "@/components/portfolio/testimonial-card";
import { Testimonials } from "./testimonials";
import styles from "./testimonials.module.scss";

function TestimonialsFallback() {
  return (
    <section className="section-space" aria-label="Professional highlights">
      <div className="site-container">
        <div className={styles.fallback}>
          {testimonials.slice(0, 2).map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  // Swiper reads the current time during rendering; isolate it from the static shell.
  return (
    <Suspense fallback={<TestimonialsFallback />}>
      <Testimonials />
    </Suspense>
  );
}
