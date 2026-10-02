import { z } from 'zod';

export const AdjudicationSchema = z.object({
  parcelId: z.string().min(1),
  conflictId: z.string().optional(),
  officerId: z.string().min(1),
  officerName: z.string().min(1),
  decision: z.enum([
    'APPROVE_AS_SURVEYED',
    'ENFORCE_DEED_BOUNDARY',
    'REQUEST_FIELD_RE_SURVEY',
    'ISSUE_ENCROACHMENT_NOTICE',
    'ADJUST_EASEMENT'
  ]),
  notes: z.string().min(5),
});
