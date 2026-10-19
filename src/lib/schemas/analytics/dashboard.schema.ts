import { z } from "zod";

export const DashboardQuerySchema = z.object({
	branch_id: z.coerce.number().int().positive().optional(),
	tenant_id: z.coerce.number().int().positive().optional(),
});

export type DashboardQueryInput = z.infer<typeof DashboardQuerySchema>;
