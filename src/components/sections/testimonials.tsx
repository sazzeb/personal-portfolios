"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { testimonials } from "@/data/portfolio";
import { TestimonialCard } from "@/components/portfolio/testimonial-card";
import { Reveal } from "@/components/ui/reveal";
import styles from "./testimonials.module.scss";

// Six slides allow Swiper's loop to remain seamless with two visible cards.
const carouselSlides = [...testimonials, ...testimonials];

export function Testimonials() {
  const swiperRef = useRef<SwiperInstance | null>(null);

  return (
    <section className="section-space" aria-label="Professional highlights">
      <div className={`site-container ${styles.wrapper}`}>
        <Reveal>
          <Swiper
            modules={[A11y, Keyboard]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            slidesPerView={1}
            spaceBetween={50}
            breakpoints={{ 800: { slidesPerView: 2 } }}
            loop
            speed={300}
            grabCursor
            tabIndex={0}
            aria-label="Professional highlights carousel"
            keyboard={{ enabled: true, onlyInViewport: true }}
            a11y={{ slideLabelMessage: "Professional highlight {{index}}" }}
          >
            {carouselSlides.map((testimonial, index) => (
              <SwiperSlide key={`${testimonial.id}-${index}`}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className={styles.controls}>
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous highlight"
            >
              <ArrowLeft size={22} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next highlight"
            >
              <ArrowRight size={22} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
