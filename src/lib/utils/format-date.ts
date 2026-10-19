export function formatDate(val: string | undefined): string {
		if (!val) return "-";
		try {
			return new Date(val).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		} catch {
			return val;
		}
	}