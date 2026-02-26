import { formatDate, formatPrice } from '@/helpers'
import { z } from 'astro:content'

export const ProcessSchema = z.object({
  label: z.string(),
  description: z.string(),
  image: z.string(),
})

export const CategorySchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  label: z.string().optional(),
  slug: z.string(),
})

export const CategoriesWPSlugSchema = z.array(CategorySchema.pick({ slug: true }))

export const BaseWPSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({ rendered: z.string() }),
  content: z.object({ rendered: z.string() }),
  featured_image_url: z.string(),
  featured_media: z.number(),
  acf: z.object({ subtitle: z.string() }),
})

export const ProcessWPSchema = BaseWPSchema.extend({
  acf: z.object({
    subtitle: z.string(),
    process: z.array(z.record(ProcessSchema)).transform((val) => {
      if (val.length === 0) return []
      const items = val[0]
      return Object.keys(items)
        .filter((key) => key.startsWith('process_'))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map((key) => items[key])
    }),
  }),
})

export const PostWPSchema = BaseWPSchema.omit({ acf: true }).extend({
  excerpt: z.object({ rendered: z.string() }),
  date: z.string().transform(formatDate),
  category_list: z.array(CategorySchema),
})

export const PostsWPListSchema = PostWPSchema.array()

export const GalleryWPSchema = BaseWPSchema.extend({
  acf: z.object({
    subtitle: z.string(),
    gallery: z.array(z.string()),
  }),
})

export const ProductWPSchema = BaseWPSchema.pick({
  title: true,
  featured_image_url: true,
}).extend({
  product_category_list: z.array(CategorySchema).optional(),
  acf: z.object({
    description: z.string(),
    price: z.coerce.number().transform(formatPrice),
  }).passthrough()
})

export const ProductsListWPSchema = z.array(ProductWPSchema)

export const LocationSchema = z.object({
  address: z.string().default(''),
  lat: z.coerce.number().default(0),
  lng: z.coerce.number().default(0),
  zoom: z.coerce.number().default(15),
})

export const ContactWPSchema = BaseWPSchema.extend({
  acf: z.object({
    subtitle: z.string(),
    location: LocationSchema,
  }),
})

// ── Schema de validación del formulario de contacto ──────────
export const ContactFormSchema = z.object({
  'your-name': z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres'),

  'your-email': z
    .string()
    .min(1, 'El email es requerido')
    .email('El email no es válido'),

  'your-subject': z
    .string()
    .min(1, 'El asunto es requerido')
    .min(2, 'El asunto debe tener al menos 2 caracteres')
    .max(200, 'El asunto no puede superar los 200 caracteres'),

  'your-message': z
    .string()
    .min(1, 'El mensaje es requerido')
    .min(20, 'El mensaje debe tener al menos 20 caracteres')
    .max(2000, 'El mensaje no puede superar los 2000 caracteres'),
})

// Tipo exportado
export type ContactFormData = z.infer<typeof ContactFormSchema>

// Tipos exportados
export type Post = z.infer<typeof PostWPSchema>
export type ProcessPage = z.infer<typeof ProcessWPSchema>
export type ProcessItem = z.infer<typeof ProcessWPSchema>['acf']['process'][number]
export type ContactPage = z.infer<typeof ContactWPSchema>
export type Location = z.infer<typeof LocationSchema>
