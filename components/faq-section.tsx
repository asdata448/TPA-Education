import { faqs } from "@/lib/data"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export function FaqSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#F8F5EC]/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[#D8B76A] font-semibold text-sm uppercase tracking-wider mb-3">
              FAQ
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F2A44] mb-4 text-balance">
              Câu hỏi thường gặp
            </h2>
            <p className="text-[#6B7280] text-lg">
              Giải đáp những thắc mắc phổ biến của phụ huynh và học sinh
            </p>
          </div>
        </ScrollReveal>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 50}>
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-white rounded-xl border border-[#E5E7EB] px-6 data-[state=open]:border-[#D8B76A] transition-all duration-300 hover:shadow-md group"
                >
                  <AccordionTrigger className="hover:no-underline py-5 text-left">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#F8F5EC] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#D8B76A]/20 group-hover:scale-110 transition-all duration-300">
                        <HelpCircle className="w-4 h-4 text-[#D8B76A]" />
                      </div>
                      <span className="text-[#0F2A44] font-medium text-base group-hover:text-[#D8B76A] transition-colors">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pl-12 text-[#6B7280] leading-relaxed animate-in slide-in-from-top-2 duration-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </ScrollReveal>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
