import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

import { HeroSection } from "@/components/showroom/HeroSection";
import { FeaturedVehicles } from "@/components/showroom/FeaturedVehicles";
import { ContactCTA } from "@/components/showroom/ContactCTA";
import { VehicleDetailPage } from "@/components/showroom/VehicleDetailPage";
import { featuredVehicles } from "@/lib/mockData";
import { siteConfig } from "@/lib/siteConfig";
import { useLanguage } from "@/lib/i18n";
import type { Vehicle } from "@/lib/vehicles";

// Stage 5 + 6 — Home page + state-toggle detail overlay.
export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { locale } = useLanguage();
  const [selected, setSelected] = React.useState<Vehicle | null>(null);

  const headline =
    locale === "ar"
      ? "جاهز لاختبار قيادتك القادمة؟"
      : "Prêt à essayer votre prochaine voiture ?";
  const sub =
    locale === "ar"
      ? "فريقنا في وهران متاح 6 أيام في الأسبوع لاستقبالك وترتيب تجربة القيادة."
      : "Notre équipe à Oran vous accueille 6 jours sur 7 pour un essai sans engagement.";
  const waMessage =
    locale === "ar"
      ? "السلام عليكم، أرغب في تحديد موعد لتجربة إحدى السيارات."
      : "Bonjour, je souhaite prendre rendez-vous pour un essai.";

  return (
    <>
      <HeroSection />
      <FeaturedVehicles vehicles={featuredVehicles} onView={setSelected} />
      <div id="contact" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-24 sm:px-6 lg:px-8">
        <ContactCTA
          headline={headline}
          subheadline={sub}
          whatsappPhone={siteConfig.dealership.whatsapp}
          callPhone={siteConfig.dealership.phone}
          address={siteConfig.dealership.address}
          hours={siteConfig.dealership.hours}
          whatsappMessage={waMessage}
          locale={locale}
        />
      </div>

      <VehicleDetailPage
        vehicle={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
        locale={locale}
      />
    </>
  );
}
