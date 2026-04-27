'use client';

interface ReadingOutputProps {
  text: string;
}

export default function ReadingOutput({ text }: ReadingOutputProps) {
  // Split by newlines and render each paragraph
  const paragraphs = text.split('\n').filter(p => p.trim().length > 0);

  return (
    <div className="reading-text space-y-3 font-serif text-base md:text-lg text-white">
      {paragraphs.map((paragraph, idx) => {
        let content: React.ReactNode = paragraph;
        let className = 'leading-relaxed text-white/90';

        if (paragraph.startsWith('•')) {
          className += ' pl-4 border-l-2 border-gold/30 text-gold/90';
        } else if (paragraph.startsWith('Card ')) {
          className += ' pl-4';
          const parts = paragraph.split(':');
          if (parts.length > 1) {
            content = (
              <div>
                <span className="text-gold/70 text-sm font-medium block mb-1">
                  {parts[0].toUpperCase()}
                </span>
                <span>{parts.slice(1).join(':')}</span>
              </div>
            );
          }
        }

        return (
          <p key={idx} className={className}>
            {content}
          </p>
        );
      })}
    </div>
  );
}
