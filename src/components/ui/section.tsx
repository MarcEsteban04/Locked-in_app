import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/cn';

/**
 * Full-bleed colour blocks. These are the backbone of the "poster" look: a
 * screen is a stack of edge-to-edge blocks with sharp transitions between
 * them, and the fill is what separates one section from the next — never a
 * rule, a border or a shadow.
 */
const tones = {
  // `decor` has to invert with the fill: white shapes vanish on a light page,
  // dark shapes vanish on a colour block.
  canvas: { container: 'bg-canvas', text: 'text-ink', decor: 'bg-ink' },
  block: { container: 'bg-block', text: 'text-ink', decor: 'bg-ink' },
  brand: { container: 'bg-brand', text: 'text-brand-on', decor: 'bg-brand-on' },
  support: { container: 'bg-support', text: 'text-support-on', decor: 'bg-support-on' },
  highlight: { container: 'bg-highlight', text: 'text-highlight-on', decor: 'bg-highlight-on' },
  /** The design system's dark-gray section. Inverts against the page. */
  slab: { container: 'bg-slab', text: 'text-slab-on', decor: 'bg-slab-on' },
} as const;

export type SectionTone = keyof typeof tones;

export interface SectionProps extends ViewProps {
  tone?: SectionTone;
  /**
   * Adds large low-opacity circles behind the content. "Strategic decoration",
   * per the design system — geometry rather than gradient or texture, so the
   * surface stays completely flat.
   */
  decorated?: boolean;
  /** Vertical rhythm inside the block. */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'py-6', md: 'py-8', lg: 'py-12' } as const;

export function Section({
  tone = 'canvas',
  decorated = false,
  size = 'md',
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <View
      className={cn('overflow-hidden px-6', tones[tone].container, sizes[size], className)}
      {...props}>
      {decorated ? (
        // Two overlapping circles, deliberately clipped by the section edge so
        // they read as a composition rather than as floating dots. Opacity is
        // low enough to stay decoration and never compete with the text.
        <>
          <View
            pointerEvents="none"
            className={cn(
              'absolute -top-24 -right-16 h-64 w-64 rounded-full opacity-10',
              tones[tone].decor,
            )}
          />
          <View
            pointerEvents="none"
            className={cn(
              'absolute -bottom-28 -left-20 h-56 w-56 rounded-full opacity-[0.07]',
              tones[tone].decor,
            )}
          />
        </>
      ) : null}

      <View className="gap-5">{children}</View>
    </View>
  );
}

/** Colour a section applies to text inside it. Exported for one-off overrides. */
export function sectionTextClass(tone: SectionTone): string {
  return tones[tone].text;
}
