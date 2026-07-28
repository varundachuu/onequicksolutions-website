import { buildMetadata } from "@/lib/metadata";
import { requireService } from "@/data/services";
import { ServicePage } from "@/components/service-page";

const service = requireService("cloud-solutions");

export const metadata = buildMetadata(
  service.metaTitle,
  service.metaDescription,
  `/${service.slug}`,
);

export default function CloudSolutionsPage() {
  return <ServicePage service={service} />;
}
