import { z } from 'zod';

export const createSessionSchema = z.object({
  candidateName: z
    .string()
    .min(2, 'Candidate name must be at least 2 characters')
    .max(100, 'Candidate name must be under 100 characters')
    .trim(),
  role: z
    .string()
    .min(2, 'Target role must be at least 2 characters')
    .max(100, 'Target role must be under 100 characters')
    .trim(),
  type: z.enum(['technical', 'behavioral', 'mixed'], {
    errorMap: () => ({ message: 'Please select a valid interview type' }),
  }),
  durationMinutes: z.coerce
    .number()
    .refine((val) => [10, 20, 30].includes(val), {
      message: 'Duration must be 10, 20, or 30 minutes',
    }),
});

export type CreateSessionDto = z.infer<typeof createSessionSchema>;
