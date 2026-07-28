import { buildMetadata } from "@/lib/metadata";
import { requireService } from "@/data/services";
import { ServicePage } from "@/components/service-page";

const service = requireService("mobile-app-development");

export const metadata = buildMetadata(
  service.metaTitle,
  service.metaDescription,
  `/${service.slug}`,
);

export default function MobileAppDevelopmentPage() {
  return <ServicePage service={service} />;
}
