import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { TrustSection } from "@/components/trust-section"
import { TutorsSection } from "@/components/tutors-section"
import { ProcessSection } from "@/components/process-section"
import { AboutSection } from "@/components/about-section"
import { CommitmentsSection } from "@/components/commitments-section"
import { ParentReportSection } from "@/components/parent-report-section"
import { FaqSection } from "@/components/faq-section"
import { ContactSection } from "@/components/contact-section"
import { FloatingCta } from "@/components/floating-cta"
import { PromoPopup } from "@/components/promo-popup"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <HeroSection />
      <TrustSection />
      <TutorsSection />
      <ProcessSection />
      <AboutSection />
      <CommitmentsSection />
      <ParentReportSection />
      <FaqSection />
      <ContactSection />
      <FloatingCta />
      <PromoPopup />
      <SiteFooter />
    </main>
  )
}
