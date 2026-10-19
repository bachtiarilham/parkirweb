import { z } from "zod";

export const ReportFilterSchema = z.object({
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	branch_id: z.coerce.number().int().positive().optional(),
	period: z.enum(["daily", "weekly", "monthly", "yearly"]).default("daily"),
});

export type ReportFilterInput = z.infer<typeof ReportFilterSchema>;
