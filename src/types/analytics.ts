import { z } from 'zod';

// Core metric types
export const MetricTypeSchema = z.enum([
  'revenue',
  'users', 
  'sessions',
  'conversion',
  'retention'
]);

export const DateRangeSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
});

export const ComparisonPeriodSchema = z.enum([
  'previous_period',
  'previous_year',
  'custom'
]);

// Analytics query schema
export const AnalyticsQuerySchema = z.object({
  dateRange: DateRangeSchema,
  metrics: z.array(MetricTypeSchema),
  comparison: ComparisonPeriodSchema.optional(),
  filters: z.record(z.string(), z.any()).optional(),
});

export const MetricDataSchema = z.object({
  id: z.string(),
  type: MetricTypeSchema,
  value: z.number(),
  change: z.number(), // percentage change
  trend: z.enum(['up', 'down', 'stable']),
  data: z.array(z.object({
    date: z.string(),
    value: z.number(),
  })),
});

export const AnalyticsResponseSchema = z.object({
  metrics: z.array(MetricDataSchema),
  summary: z.object({
    totalRevenue: z.number(),
    totalUsers: z.number(),
    averageConversion: z.number(),
  }),
  timeframe: z.object({
    current: DateRangeSchema,
    previous: DateRangeSchema.optional(),
  }),
});

// Infer TypeScript types from Zod schemas
export type MetricType = z.infer<typeof MetricTypeSchema>;
export type DateRange = z.infer<typeof DateRangeSchema>;
export type AnalyticsQuery = z.infer<typeof AnalyticsQuerySchema>;
export type MetricData = z.infer<typeof MetricDataSchema>;
export type AnalyticsResponse = z.infer<typeof AnalyticsResponseSchema>;