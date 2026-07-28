import { buildMetadata } from "@/lib/metadata";
import { requireService } from "@/data/services";
import { ServicePage } from "@/components/service-page";

const service = requireService("hr-consulting");

export const metadata = buildMetadata(
  service.metaTitle,
  service.metaDescription,
  `/${service.slug}`,
);

export default function HrConsultingPage() {
  return <ServicePage service={service} />;
}
