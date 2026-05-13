import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { TrustSection } from "@/components/trust-section"
import { AboutSection } from "@/components/about-section"
import { SubjectsSection } from "@/components/subjects-section"
import { TutorsSection } from "@/components/tutors-section"
import { ProcessSection } from "@/components/process-section"
import { LearningPathSection } from "@/components/learning-path-section"
import { PackagesSection } from "@/components/packages-section"
import { MidCtaSection } from "@/components/mid-cta-section"
import { CommitmentsSection } from "@/components/commitments-section"
import { ParentReportSection } from "@/components/parent-report-section"
import { FaqSection } from "@/components/faq-section"
import { ContactSection } from "@/components/contact-section"
import { FloatingCta } from "@/components/floating-cta"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <HeroSection />
      <TrustSection />
      <AboutSection />
      <SubjectsSection />
      <TutorsSection />
      <ProcessSection />
      <LearningPathSection />
      <PackagesSection />
      <MidCtaSection />
      <CommitmentsSection />
      <ParentReportSection />
      <FaqSection />
      <ContactSection />
      <FloatingCta />
      <SiteFooter />
    </main>
  )
}
