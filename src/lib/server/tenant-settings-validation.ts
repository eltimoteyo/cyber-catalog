import { z } from 'zod';

const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, 'Invalid hex color');

const optionalUrlSchema = z
  .string()
  .trim()
  .max(2048, 'URL is too long')
  .optional()
  .transform((value) => value || '')
  .refine((value) => !value || /^https?:\/\//i.test(value), 'Invalid URL');

const optionalHandleOrUrlSchema = z
  .string()
  .trim()
  .max(120, 'Social handle is too long')
  .optional()
  .transform((value) => value || '');

const optionalPhoneSchema = z
  .string()
  .trim()
  .max(24, 'Phone number is too long')
  .optional()
  .transform((value) => value || '')
  .refine((value) => !value || /^[+0-9\s()-]+$/.test(value), 'Invalid phone number');

const heroSlideSchema = z.object({
  id: z.string().trim().min(1).max(80),
  image: z.string().trim().max(2048).url('Invalid hero slide image URL'),
  title: z.string().trim().max(140).optional().default(''),
  subtitle: z.string().trim().max(280).optional().default(''),
  buttonText: z.string().trim().max(60).optional().default(''),
  order: z.coerce.number().int().min(0).max(100).optional(),
});

export const tenantSettingsPatchSchema = z
  .object({
    logo: optionalUrlSchema,
    primaryColor: hexColorSchema.optional(),
    whatsapp: optionalPhoneSchema,
    domain: z
      .union([
        z
          .string()
          .trim()
          .max(253)
          .regex(/^[a-zA-Z0-9.-]+$/, 'Invalid domain format'),
        z.null(),
      ])
      .optional(),
    subdomain: z
      .union([
        z
          .string()
          .trim()
          .max(63)
          .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, 'Invalid subdomain format'),
        z.null(),
      ])
      .optional(),
    colors: z
      .object({
        primary: hexColorSchema,
        secondary: hexColorSchema,
        accent: hexColorSchema.optional(),
      })
      .optional(),
    socialMedia: z
      .object({
        instagram: optionalHandleOrUrlSchema,
        facebook: optionalHandleOrUrlSchema,
        tiktok: optionalHandleOrUrlSchema,
      })
      .optional(),
    heroSlides: z.array(heroSlideSchema).max(10, 'Too many hero slides').optional(),
  })
  .passthrough();

export type TenantSettingsPatchPayload = z.infer<typeof tenantSettingsPatchSchema>;
