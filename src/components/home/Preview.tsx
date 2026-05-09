'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import { usePersonalizationContext } from '@/components/personalization/PersonalizationProvider';

interface TarotCard {
  name: string;
  image: string;
  emoji: string;
  interpretation: string;
}

export default function Preview() {
  const { t, isHydrated } = useLanguage();
  const { profile } = usePersonalizationContext();

  const getUserName = () => {
    if (!profile) return '';
    const metadata = profile as any;
    const name = metadata?.metadata?.name || metadata?.name;
    return name ? name.split(' ')[0] : '';
  };

  const userName = getUserName();

  const previewReading = {
    personalOpening: isHydrated
      ? t('landing.preview.personalOpening', { name: userName })
      : userName
        ? `Arey yaar ${userName}… cards tumhari energy bohot strongly feel kar rahe hain. 💖`
        : 'Arey yaar… cards tumhari energy bohot strongly feel kar rahe hain. 💖',

    cards: [
      {
        name: isHydrated ? t('landing.preview.card1.name') : 'The Fool',
        image: '/card_img/The Fool.png',
        emoji: '🌟',
        interpretation: isHydrated
          ? t('landing.preview.card1.interpretation')
          : 'Yeh card umeed, healing aur inspiration dikhta hai. Universe clarity la raha hai. ✨',
      },
      {
        name: isHydrated ? t('landing.preview.card2.name') : 'The Lovers',
        image: '/card_img/The Lovers.png',
        emoji: '💰',
        interpretation: isHydrated
          ? t('landing.preview.card2.interpretation')
          : 'Yeh stability aur emotional security ka card hai. Family bonds strong hain. 💖',
      },
      {
        name: isHydrated ? t('landing.preview.card3.name') : 'The Star',
        image: '/card_img/The Star.png',
        emoji: '🎉',
        interpretation: isHydrated
          ? t('landing.preview.card3.interpretation')
          : 'Celebration aur harmony ka sign hai! Kuch exciting hone wala hai. 🪄',
      },
    ],

    guidance: userName
      ? `${userName}, universe ek hi cheez keh raha hai — trust the process. 💫 Jo connection tum feel kar rahe ho woh random nahi hai.`
      : isHydrated
        ? t('landing.preview.guidanceBlock.text')
        : 'Universe tumhe trust the process keh raha hai. 💫 Jo connection tum feel kar rahe ho woh random nahi hai.',

    cliffhanger: isHydrated
      ? t('landing.preview.previewLock')
      : 'Mayank… cards ke andar aur bohot kuch reveal ho raha hai. 🌙',

    ctaButton: isHydrated
      ? t('landing.preview.ctaButton')
      : 'Full Reading Dekho ✨',

    ctaSubtext: isHydrated
      ? t('landing.preview.ctaSubtext')
      : 'Universe Ka Message Unlock Karo 🌙',
  };

  return (
    <section className="relative bg-background py-8 md:py-12 overflow-hidden">
      <div className="w-[90%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-[32px] border border-yellow-500/20 bg-gradient-to-br from-[#140A24] to-[#0B0B0F] backdrop-blur-xl shadow-[0_0_80px_rgba(255,215,0,0.08)] min-h-[80vh] max-h-[85vh] flex flex-col justify-between"
        >
          {/* CONTENT CONTAINER */}
          <div className="px-6 md:px-10 lg:px-14 py-6 flex flex-col">
            {/* SECTION 1: COMPACT EMOTIONAL OPENING */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-200 text-base md:text-lg font-serif italic px-6 py-3 rounded-2xl bg-gradient-to-br from-[#1A0B2E] to-[#0B0B0F] border border-yellow-500/20 inline-block">
                {previewReading.personalOpening}
              </p>
            </motion.div>

            {/* SECTION 2: MESSAGE OF THE CARDS */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center gap-3 my-6"
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-yellow-400/40" />
              <h3 className="font-heading text-yellow-300 text-lg md:text-xl tracking-wide font-semibold">
                {isHydrated ? t('landing.preview.messageOfCards') : 'Cards Ka Message'}
              </h3>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-yellow-400/40" />
            </motion.div>

            {/* SECTION 3: CARD READINGS - 3 COLUMN GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {previewReading.cards.map((card, index) => (
                <motion.div
                  key={card.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="flex flex-col items-center text-center h-full"
                >
                  <div className="relative aspect-[3/4] w-full max-w-[180px] rounded-2xl overflow-hidden shadow-2xl shadow-yellow-500/20 mb-4">
                    <Image
                      src={card.image}
                      alt={card.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2">
                      <span className="text-xl">{card.emoji}</span>
                    </div>
                  </div>
                  <h4 className="text-yellow-300 text-lg md:text-xl font-heading font-semibold mb-2">
                    {card.name}
                  </h4>
                  <p className="text-gray-200 text-sm md:text-base leading-relaxed font-serif italic flex-grow">
                    {card.interpretation}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* SECTION 4: GUIDANCE & MOTIVATION */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <h4 className="text-yellow-300 text-lg font-heading font-semibold mb-3">
                ✨ Guidance &amp; Motivation
              </h4>
              <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 px-6 py-5">
                <p className="text-yellow-100/90 text-base md:text-lg leading-relaxed font-serif italic">
                  {previewReading.guidance}
                </p>
              </div>
            </motion.div>

            {/* SECTION 5: EMOTIONAL CLIFFHANGER */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-center"
            >
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                {previewReading.cliffhanger}
              </p>
            </motion.div>
          </div>

          {/* SECTION 6: CTA BUTTON */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="px-6 md:px-10 lg:px-14 pt-2 pb-8"
          >
            <Link
              href="/reading"
              className="block w-full max-w-[700px] mx-auto rounded-full bg-gradient-to-r from-[#FF5F6D] to-[#FFC371] text-black font-semibold text-lg py-4 px-6 text-center hover:scale-[1.02] transition-all duration-300 shadow-[0_0_50px_rgba(255,193,113,0.45)]"
            >
              {previewReading.ctaButton}
              <p className="mt-1 text-sm text-black/70 font-normal">
                {previewReading.ctaSubtext}
              </p>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}