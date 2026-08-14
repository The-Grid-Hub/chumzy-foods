'use client'
import Image, { type StaticImageData } from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import egusiImg from '@/public/products/egusi-melon-seeds.jpg'
import garriImg from '@/public/products/yellow-garri.jpg'
import ogbonoImg from '@/public/products/ogbono-wild-mango-seeds.jpg'
import { PRODUCTS } from '@/lib/products'
import type { Product } from '@/lib/types'

interface Panel {
  product: Product
  image: StaticImageData
  alt: string
  /** Position + width within the collage frame. */
  className: string
  /** Entrance delay, continuing the Hero's stagger. */
  delay: number
  /** Ken Burns loop duration — varied so panels drift apart. */
  zoom: number
}

function bySlug(slug: string): Product {
  const product = PRODUCTS.find((p) => p.slug === slug)
  if (!product) throw new Error(`HeroShowcase: no product with slug "${slug}"`)
  return product
}

const panels: Panel[] = [
  {
    product: bySlug('egusi-melon-seeds'),
    image: egusiImg,
    alt: 'A basket heaped with pale egusi melon seeds beside a metal measuring cup',
    className: 'left-0 top-4 w-[42%]',
    delay: 0.3,
    zoom: 20,
  },
  {
    product: bySlug('yellow-garri'),
    image: garriImg,
    alt: 'A golden mound of freshly milled yellow garri in a wide bowl',
    className: 'right-0 top-16 w-[50%]',
    delay: 0.45,
    zoom: 24,
  },
  {
    product: bySlug('ogbono-wild-mango-seeds'),
    image: ogbonoImg,
    alt: 'Flat tan ogbono wild mango seeds piled in a woven market basket',
    className: 'left-[6%] bottom-0 w-[40%]',
    delay: 0.6,
    zoom: 22,
  },
]

function ProductPanel({ panel, still }: { panel: Panel; still: boolean }) {
  const { product } = panel

  return (
    <motion.figure
      initial={{ opacity: 0, x: 30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: panel.delay }}
      className={`absolute ${panel.className} aspect-[3/4] rounded-3xl overflow-hidden
                  ring-1 ring-white/15 shadow-2xl`}
    >
      <motion.div
        className="absolute inset-0"
        animate={still ? undefined : { scale: [1, 1.12] }}
        transition={
          still
            ? undefined
            : {
                duration: panel.zoom,
                delay: panel.delay,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              }
        }
      >
        <Image
          src={panel.image}
          alt={panel.alt}
          fill
          priority
          sizes="(min-width: 1024px) 22vw, 0px"
          placeholder="blur"
          className="object-cover"
        />
      </motion.div>

      {/* Scrim so the caption stays legible over any photo */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

      {product.featured && (
        <span className="absolute top-3 left-3 badge bg-brand-amber text-white text-[10px]">
          Popular
        </span>
      )}

      <figcaption
        className="absolute bottom-3 left-3 right-3 rounded-full bg-black/35 backdrop-blur-sm
                   px-3 py-1.5 text-white text-xs font-semibold truncate"
      >
        {product.name}
      </figcaption>
    </motion.figure>
  )
}

export default function HeroShowcase() {
  const still = useReducedMotion() ?? false

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[1/1.05]">
      {/* Soft glow lifting the panels off the gradient */}
      <div className="absolute inset-8 rounded-full bg-brand-amber opacity-20 blur-3xl" />

      {panels.map((panel) => (
        <ProductPanel key={panel.product.slug} panel={panel} still={still} />
      ))}
    </div>
  )
}
