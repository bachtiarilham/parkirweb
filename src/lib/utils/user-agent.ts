export interface ParsedUserAgent {
	browser: string;
	os: string;
	device: "desktop" | "mobile" | "tablet";
}

export function parseUserAgent(uaString?: string | null): ParsedUserAgent {
	if (!uaString) {
		return { browser: "Browser", os: "Unknown OS", device: "desktop" };
	}

	let browser = "Browser";
	if (uaString.includes("Firefox")) browser = "Firefox";
	else if (uaString.includes("Chrome")) browser = "Chrome";
	else if (uaString.includes("Safari")) browser = "Safari";
	else if (uaString.includes("Edge")) browser = "Edge";

	let os = "Desktop";
	if (uaString.includes("Windows")) os = "Windows";
	else if (uaString.includes("Mac OS")) os = "macOS";
	else if (uaString.includes("Linux")) os = "Linux";
	else if (uaString.includes("Android")) os = "Android";
	else if (uaString.includes("iPhone") || uaString.includes("iPad")) os = "iOS";

	let device: "desktop" | "mobile" | "tablet" = "desktop";
	if (uaString.includes("Mobile") || uaString.includes("Android") || uaString.includes("iPhone")) {
		device = "mobile";
	} else if (uaString.includes("iPad") || uaString.includes("Tablet")) {
		device = "tablet";
	}

	return { browser, os, device };
}
