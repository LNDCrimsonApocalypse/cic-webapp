'use client'

import { Service } from '@/lib/services'

interface UserServiceTypeCardProps {
  service: Service
  onSelect: (serviceType: string) => void
}

export default function UserServiceTypeCard({ service, onSelect }: UserServiceTypeCardProps) {
  const Icon = service.icon

  return (
    <button
      type="button"
      onClick={() => onSelect(service.serviceType)}
      aria-label={`Select ${service.title}`}
      className={[
        'group text-left w-full h-full flex flex-col gap-4',
        'rounded-xl border p-6',
        // Light default: solid white with subtle navy-tinted border.
        'bg-white border-[#001A41]/10',
        // Dark default: frosted glass over the navy gradient.
        'dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10',
        'outline outline-2 outline-transparent -outline-offset-2',
        'transition-all duration-200 ease-out',
        // Light hover/focus/active: full navy inversion + gold outline + glow + lift.
        'hover:bg-[#001A41] hover:outline-[#FFD700] hover:-translate-y-0.5',
        'hover:shadow-[0_0_0_4px_rgba(255,215,0,0.25),0_10px_30px_rgba(0,26,65,0.25)]',
        'focus-visible:bg-[#001A41] focus-visible:outline-[#FFD700] focus-visible:-translate-y-0.5',
        'focus-visible:shadow-[0_0_0_4px_rgba(255,215,0,0.25),0_10px_30px_rgba(0,26,65,0.25)]',
        'active:bg-[#001A41] active:outline-[#FFD700] active:-translate-y-0.5',
        'active:shadow-[0_0_0_4px_rgba(255,215,0,0.25),0_10px_30px_rgba(0,26,65,0.25)]',
        // Dark hover/focus/active: glass → solid white instead of navy.
        'dark:hover:bg-white dark:hover:backdrop-blur-none',
        'dark:focus-visible:bg-white dark:focus-visible:backdrop-blur-none',
        'dark:active:bg-white dark:active:backdrop-blur-none',
      ].join(' ')}
    >
      {/* Icon tile */}
      <div
        aria-hidden="true"
        className={[
          'w-10 h-10 rounded-lg flex items-center justify-center',
          // Light default
          'bg-[#001A41]/[0.08]',
          // Dark default (inverted: light tile against dark glass)
          'dark:bg-white/10',
          // Light hover → white-on-navy tile
          'group-hover:bg-white/10 group-focus-visible:bg-white/10 group-active:bg-white/10',
          // Dark hover → revert to navy-tinted tile (since card is now white)
          'dark:group-hover:bg-[#001A41]/[0.08] dark:group-focus-visible:bg-[#001A41]/[0.08] dark:group-active:bg-[#001A41]/[0.08]',
          'transition-colors duration-200 ease-out',
        ].join(' ')}
      >
        <Icon
          size={20}
          className={[
            'text-[#001A41]',
            'dark:text-white',
            'group-hover:text-white group-focus-visible:text-white group-active:text-white',
            'dark:group-hover:text-[#001A41] dark:group-focus-visible:text-[#001A41] dark:group-active:text-[#001A41]',
            'transition-colors duration-200 ease-out',
          ].join(' ')}
        />
      </div>

      {/* Title */}
      <h3
        className={[
          'font-marcellus text-[18px] leading-snug',
          'text-[#001A41]',
          'dark:text-white',
          'group-hover:text-white group-focus-visible:text-white group-active:text-white',
          'dark:group-hover:text-[#001A41] dark:group-focus-visible:text-[#001A41] dark:group-active:text-[#001A41]',
          'transition-colors duration-200 ease-out',
        ].join(' ')}
      >
        {service.title}
      </h3>

      {/* Description */}
      <p
        className={[
          'font-metropolis text-sm leading-relaxed flex-1',
          'text-[#001A41]/60',
          'dark:text-white/75',
          'group-hover:text-white/75 group-focus-visible:text-white/75 group-active:text-white/75',
          'dark:group-hover:text-[#001A41]/60 dark:group-focus-visible:text-[#001A41]/60 dark:group-active:text-[#001A41]/60',
          'transition-colors duration-200 ease-out',
        ].join(' ')}
      >
        {service.description}
      </p>

      {/* Tag pills */}
      <div className="flex flex-wrap gap-2 pt-1">
        {service.tags.map((tag) => (
          <span
            key={tag}
            className={[
              'px-2.5 py-1 text-xs font-metropolis rounded-full border',
              // Light default: gray-filled solid pill
              'bg-gray-100 text-gray-700 border-transparent',
              // Dark default: outlined-white pill against the glass
              'dark:bg-transparent dark:text-white/90 dark:border-white/25',
              // Light hover: outlined-white on navy bg
              'group-hover:bg-transparent group-hover:text-white/90 group-hover:border-white/25',
              'group-focus-visible:bg-transparent group-focus-visible:text-white/90 group-focus-visible:border-white/25',
              'group-active:bg-transparent group-active:text-white/90 group-active:border-white/25',
              // Dark hover: revert to gray-filled (since card is now white)
              'dark:group-hover:bg-gray-100 dark:group-hover:text-gray-700 dark:group-hover:border-transparent',
              'dark:group-focus-visible:bg-gray-100 dark:group-focus-visible:text-gray-700 dark:group-focus-visible:border-transparent',
              'dark:group-active:bg-gray-100 dark:group-active:text-gray-700 dark:group-active:border-transparent',
              'transition-colors duration-200 ease-out',
            ].join(' ')}
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  )
}
