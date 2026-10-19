export function formatCurrency(val: string | number | undefined): string {
   if (val === undefined || val === null) return "Rp 0";
   const num = typeof val === "string" ? parseFloat(val) : val;
   if (isNaN(num)) return "Rp 0";
   return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
   }).format(num);
}