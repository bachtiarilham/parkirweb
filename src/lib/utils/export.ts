export function exportToCSV(data: Record<string, unknown>[], filename: string) {
	if (!data || !data.length) return;
	const headers = Object.keys(data[0]);
	const csvRows = [
		headers.join(","),
		...data.map((row) =>
			headers
				.map((field) => {
					const val = row[field] ?? "";
					const escaped = String(val).replace(/"/g, '""');
					return `"${escaped}"`;
				})
				.join(",")
		),
	];
	const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
	downloadBlob(blob, `${filename}.csv`);
}

export function exportToJSON(data: unknown, filename: string) {
	const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
	downloadBlob(blob, `${filename}.json`);
}

function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
