import { z } from 'zod';
import { NextResponse } from 'next/server';

/**
 * Validation Schemas for All API Endpoints
 * 
 * Using Zod for runtime type validation with detailed error messages.
 * All schemas are exported for reuse in middleware and tests.
 */

// ========== SHARED SCHEMAS ==========

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(255, 'Email too long')
  .trim()
  .toLowerCase();

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number too long')
  .regex(/^[+]?[0-9]+$/, 'Invalid phone number format');

export const uuidSchema = z
  .string()
  .uuid('Invalid UUID format')
  .or(z.string().length(8).regex(/^[0-9a-fA-F]+$/)); // Allow short IDs too

// ========== SUBSCRIPTION SCHEMAS ==========

export const subscribeSchema = z.object({
  email: emailSchema,
});

// ========== READING SCHEMAS ==========

export const startReadingSchema = z.object({
  question: z
    .string()
    .min(5, 'Question must be at least 5 characters')
    .max(500, 'Question too long (max 500 chars)')
    .trim(),
  topic: z
    .string()
    .min(2, 'Topic required')
    .max(50, 'Topic too long')
    .optional()
    .default('general'),
  spreadType: z
    .enum(['single', 'three-card', 'celtic-cross', 'relationship', 'yesno'])
    .default('single'),
  language: z
    .enum(['en', 'hi', 'hinglish', 'ar', 'he'])
    .default('hinglish'),
  name: z
    .string()
    .min(1)
    .max(100)
    .optional()
    .default('Seeker'),
});

export const readingFeedbackSchema = z.object({
  readingId: uuidSchema,
  rating: z.number().min(1).max(5).int(),
  feedback: z.string().max(500).optional(),
});

// ========== PAYMENT SCHEMAS ==========

export const paymentInitSchema = z.object({
  amount: z.number().int().positive('Amount must be positive').max(100000, 'Amount too large'),
  planType: z.enum(['monthly', 'quarterly', 'yearly']),
  currency: z.string().default('INR'),
  userId: uuidSchema.optional(),
});

export const razorpayWebhookSchema = z.object({
  event: z.string(),
  payload: z.object({
    payment: z.object({
      entity: z.object({
        id: z.string(),
        order_id: z.string(),
        status: z.string(),
        amount: z.number(),
      }),
    }).optional(),
    subscription: z.object({
      entity: z.object({
        id: z.string(),
        status: z.string(),
      }),
    }).optional(),
  }),
  created_at: z.number(),
});

// ========== USER SCHEMAS ==========

export const userProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: phoneSchema.optional().nullable(),
  email: emailSchema.optional().nullable(),
  metadata: z.record(z.unknown()).optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// ========== TRACKING SCHEMAS ==========

export const trackEventSchema = z.object({
  eventName: z.string().min(1).max(100),
  metadata: z.record(z.unknown()).optional(),
  source: z.string().optional(),
});

// ========== CHAT SCHEMAS ==========

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(2000).trim(),
  context: z.string().optional(),
  userId: uuidSchema.optional(),
});

// ========== ADMIN SCHEMAS ==========

export const translationUpdateSchema = z.object({
  key: z.string().min(1).max(200),
  value: z.string().min(1).max(5000),
  language: z.enum(['en', 'hi', 'hinglish', 'ar', 'he']),
});

// ========== COMMON RESPONSES ==========

export const errorResponseSchema = z.object({
  error: z.string(),
  details: z.record(z.unknown()).optional(),
});

export const successResponseSchema = z.object({
  message: z.string(),
  success: z.literal(true),
});

// ========== VALIDATION UTILITIES ==========

/**
 * Parse and validate request body with given schema
 * Returns NextResponse on error
 */
export function validateRequest<T extends z.ZodTypeAny>(
  schema: T,
  body: unknown
): { success: true; data: z.infer<T> } | { success: false; response: Response } {
  try {
    const data = schema.parse(body);
    return { success: true, data };
  } catch (err: any) {
    if (err?.issues) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'Validation failed',
            issues: err.issues.map((issue: any) => ({
              field: issue.path.join('.'),
              message: issue.message,
              code: issue.code,
            })),
          },
          { status: 422 }
        ),
      };
    }

    return {
      success: false,
      response: NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      ),
    };
  }
}

/**
 * Sanitize user input for XSS prevention
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, (c) => (c === '<' ? '&lt;' : '&gt;'))
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Deep sanitize object values
 * NOTE: Returns a new sanitized object (doesn't mutate original)
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key]) as any;
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null && !Array.isArray(sanitized[key])) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }
  return sanitized;
}
