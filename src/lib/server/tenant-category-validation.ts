import { z } from 'zod';

const ICON_NAME_REGEX = /^[A-Za-z][A-Za-z0-9]*$/;

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function toSlug(label: string): string {
  return normalizeText(label)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

export const tenantCategoryPayloadSchema = z
  .object({
    label: z
      .string()
      .trim()
      .min(1, 'Category label is required')
      .max(80, 'Category label is too long')
      .transform(normalizeText),
    icon: z
      .string()
      .trim()
      .max(64, 'Icon name is too long')
      .regex(ICON_NAME_REGEX, 'Invalid icon name')
      .optional()
      .default('Package'),
    order: z.coerce.number().int().min(0).max(10_000).optional().default(0),
  })
  .transform((payload) => ({
    ...payload,
    value: toSlug(payload.label),
  }));

export type TenantCategoryPayload = z.infer<typeof tenantCategoryPayloadSchema>;
