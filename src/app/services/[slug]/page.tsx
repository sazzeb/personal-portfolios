import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { services } from "@/data/services";
import { sammyImages } from "@/data/sammy-images";
import { serviceDetails } from "@/data/service-details";
import { sammy } from "@/config/sammy";
import { Check } from "lucide-react";
import { PageBanner } from "@/components/ui/page-banner";
import { DetailLayout } from "@/components/portfolio/detail-layout";
import { DetailLoading } from "@/components/portfolio/detail-loading";
import { ContactSection } from "@/components/sections/contact-section";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title:
      services.find((service) => service.slug === slug)?.title ?? "Service",
  };
}

export default function ServicePage({ params }: ServicePageProps) {
  return (
    <main id="main-content" className="section-space-bottom">
      <PageBanner title="Service Details" />
      <Suspense fallback={<DetailLoading label="Loading service…" />}>
        <ServiceDetails params={params} />
      </Suspense>
      <ContactSection />
    </main>
  );
}

async function ServiceDetails({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const detail = serviceDetails[service.slug];

  return (
    <DetailLayout
      title={service.title}
      image={sammyImages.serviceDetails.path}
      imageAlt={sammyImages.serviceDetails.alt}
      imageWidth={sammyImages.serviceDetails.width}
      imageHeight={sammyImages.serviceDetails.height}
      category={service.title}
      detailsTitle="Service Overview"
      facts={[
        { label: "Specialization", value: service.title },
        { label: "Engineer", value: sammy.name },
        { label: "Experience", value: detail.context },
        { label: "Technologies", value: detail.technologies },
      ]}
    >
      <p>{service.description}</p>
      <p>{detail.overview}</p>
      <h3>Technical Focus</h3>
      <p>{detail.technologies}</p>
      {detail.engagements.map((engagement) => (
        <section key={engagement.organization}>
          <h3>{engagement.organization}</h3>
          <p className="text-accent">
            {engagement.role} · {engagement.period}
          </p>
          <h4 className="font-display text-xl">Work Delivered</h4>
          <p>{engagement.work}</p>
          <h4 className="font-display text-xl">Achievements & Outcomes</h4>
          <ul>
            {engagement.achievements.map((achievement) => (
              <li key={achievement}>
                <Check size={18} aria-hidden="true" />
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <h3>How I Approach This Work</h3>
      <p>{detail.approach}</p>
    </DetailLayout>
  );
}
