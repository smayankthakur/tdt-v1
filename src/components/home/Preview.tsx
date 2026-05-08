'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { usePersonalizationContext } from '@/components/personalization/PersonalizationProvider';

export default function Preview() {
  const { t, isHydrated } = useLanguage();
  const { profile } = usePersonalizationContext();

  // Get user's first name from personalization metadata
  const getUserName = () => {
    if (!profile) return '';
    // Try to get name from metadata
    const metadata = profile as any;
    const name = metadata?.metadata?.name || metadata?.name;
    if (name) return name.split(' ')[0]; // First name only
    return '';
  };

  const userName = getUserName();

   // Interpolated opening text
   const personalOpening = isHydrated
     ? t('landing.preview.personalOpening', { name: userName })
     : userName
     ? `Arey yaar ${userName}… cards tumhari energy bohot strongly feel kar rahe hain. 💖\n\nLagta hai tumhare dil mein kaafi confusion aur emotional pull chal raha hai…\n\nChalo dekhte hain universe tumhe kya message dena chahta hai. ✨`
     : 'Arey yaar… cards tumhari energy bohot strongly feel kar rahe hain. 💖\n\nLagta hai tumhare dil mein kaafi confusion aur emotional pull chal raha hai…\n\nChalo dekhte hain universe tumhe kya message dena chahta hai. ✨';

   // Guidance block text - prepend name if available
   const getGuidanceText = () => {
     const base = isHydrated
       ? t('landing.preview.guidanceBlock.text')
       : 'Universe tumhe ek hi cheez bol raha hai — trust the process. 💫\n\nJo connection tum feel kar rahe ho woh random nahi hain. Abhi bas apni energy ko positive rakhna zaroori hai.';
     return userName ? `${userName}, ${base}` : base;
   };

  const guidanceText = getGuidanceText();

  return (
    <section className="py-section bg-background">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-block"
        >
          <h2 className="font-heading text-heading text-foreground">
            {isHydrated ? t('landing.preview.title') : 'A Glimpse Into Your Journey'}
          </h2>
          <p className="mt-element text-foreground-muted max-w-2xl mx-auto">
            {isHydrated ? t('landing.preview.subtitle') : 'What the cards might reveal for you'}
          </p>
        </motion.div>

        {/* Main Preview Card - Premium Design */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#120B1F] to-[#0B0B0F] backdrop-blur-xl border border-gold-30 shadow-glow-gold-sm"
        >
          {/* Ambient glow effects */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-[rgba(var(--gold),0.2)] rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[rgba(var(--secondary),0.2)] rounded-full blur-[100px]" />
          </div>

          <div className="relative p-6 sm:p-10">
            {/* SECTION 1: PERSONAL OPENING */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-10 text-center"
            >
              <p className="text-body-base sm:text-body-lg text-foreground-secondary leading-relaxed font-serif italic">
                {personalOpening}
              </p>
            </motion.div>

            {/* SECTION 2: MESSAGE OF THE CARDS */}
            <div className="space-y-8">
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center justify-center gap-3 mb-8"
              >
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[rgba(var(--gold),0.3)]" />
                <span className="font-heading text-subheading text-accent-gold">
                  {t('landing.preview.messageOfCards')}
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[rgba(var(--gold),0.3)]" />
              </motion.div>

              {/* Cards Layout - Premium centered with hover effects */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {/* Card 1 */}
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.1 }}
                   whileHover={{ scale: 1.05 }}
                   className="group relative"
                 >
                   <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-surface-60 to-surface-80 backdrop-blur-sm border border-[rgba(var(--gold),0.2)] transition-all duration-300 hover:border-[rgba(var(--gold),0.5)] hover:shadow-glow-gold-sm p-6 flex flex-col items-center text-center gap-5">
                     {/* Glow on hover */}
                     <div className="absolute inset-0 bg-gradient-to-b from-[rgba(var(--gold),0.05)] via-transparent to-[rgba(var(--gold),0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                     {/* Card Image - Large */}
                     <div className="relative w-32 h-44 sm:w-40 sm:h-56 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
                       <Image
                         src="/card_img/The Fool.png"
                         alt={t('landing.preview.card1.name')}
                         fill
                         className="object-cover transition-transform duration-500 group-hover:scale-110"
                       />
                       {/* Image overlay glow */}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                     </div>

                     {/* Card Name */}
                     <div className="relative z-10">
                       <h4 className="font-heading text-lg sm:text-xl text-gold mb-2">
                         {t('landing.preview.card1.name')}
                       </h4>
                       {/* Interpretation */}
                       <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed font-serif italic">
                         {t('landing.preview.card1.interpretation')}
                       </p>
                     </div>
                   </div>
                 </motion.div>

                {/* Card 2 */}
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.2 }}
                   whileHover={{ scale: 1.05 }}
                   className="group relative"
                 >
                   <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-surface-60 to-surface-80 backdrop-blur-sm border border-[rgba(var(--gold),0.2)] transition-all duration-300 hover:border-[rgba(var(--gold),0.5)] hover:shadow-glow-gold-sm p-6 flex flex-col items-center text-center gap-5">
                     <div className="absolute inset-0 bg-gradient-to-b from-[rgba(var(--gold),0.05)] via-transparent to-[rgba(var(--gold),0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                     <div className="relative w-32 h-44 sm:w-40 sm:h-56 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
                       <Image
                         src="/card_img/The Lovers.png"
                         alt={t('landing.preview.card2.name')}
                         fill
                         className="object-cover transition-transform duration-500 group-hover:scale-110"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                     </div>

                     <div className="relative z-10">
                       <h4 className="font-heading text-lg sm:text-xl text-gold mb-2">
                         {t('landing.preview.card2.name')}
                       </h4>
                       <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed font-serif italic">
                         {t('landing.preview.card2.interpretation')}
                       </p>
                     </div>
                   </div>
                 </motion.div>

                {/* Card 3 */}
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.3 }}
                   whileHover={{ scale: 1.05 }}
                   className="group relative"
                 >
                   <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-surface-60 to-surface-80 backdrop-blur-sm border border-[rgba(var(--gold),0.2)] transition-all duration-300 hover:border-[rgba(var(--gold),0.5)] hover:shadow-glow-gold-sm p-6 flex flex-col items-center text-center gap-5">
                     <div className="absolute inset-0 bg-gradient-to-b from-[rgba(var(--gold),0.05)] via-transparent to-[rgba(var(--gold),0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                     <div className="relative w-32 h-44 sm:w-40 sm:h-56 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
                       <Image
                         src="/card_img/The Star.png"
                         alt={t('landing.preview.card3.name')}
                         fill
                         className="object-cover transition-transform duration-500 group-hover:scale-110"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                     </div>

                     <div className="relative z-10">
                       <h4 className="font-heading text-lg sm:text-xl text-gold mb-2">
                         {t('landing.preview.card3.name')}
                       </h4>
                       <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed font-serif italic">
                         {t('landing.preview.card3.interpretation')}
                       </p>
                     </div>
                   </div>
                 </motion.div>
              </div>
            </div>

            {/* SECTION 3: GUIDANCE BLOCK - Special Styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10 mb-10"
            >
               <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[rgba(var(--gold),0.1)] via-[rgba(var(--gold),0.05)] to-transparent border border-[rgba(var(--gold),0.2)] p-8 text-center">
                {/* Subtle animated glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(var(--gold),0.1)] to-transparent animate-shimmer" />

                <p className="relative z-10 text-body-base sm:text-body-lg text-foreground leading-relaxed font-serif italic whitespace-pre-line max-w-2xl mx-auto">
                  {guidanceText}
                </p>
              </div>
            </motion.div>

            {/* SECTION 4: PREVIEW LOCK / CLIFFHANGER */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 pt-8 border-t border-gold-10 text-center"
            >
              <p className="text-body text-foreground-muted max-w-2xl mx-auto leading-relaxed">
                {isHydrated ? t('landing.preview.previewLock') : 'Cards have so much more to reveal… Your future, next actions, and hidden emotions are still veiled. 🌙'}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* SECTION 5: CTA BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-block text-center"
        >
          <Link
            href="/reading"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'btn-cta-pulse w-full sm:w-auto flex items-center justify-center gap-2 text-lg px-10 py-5'
            )}
          >
            <span>{isHydrated ? t('landing.preview.ctaButton') : "Unlock My Full Reading ✨"}</span>
            <ArrowRight className="h-6 w-6" />
          </Link>
          <p className="mt-element text-body-sm text-foreground-muted">
            {isHydrated ? t('landing.preview.ctaSubtext') : 'Takes less than 60 seconds'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}