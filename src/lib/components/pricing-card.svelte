<script lang="ts">
	import Check from "@lucide/svelte/icons/check";
   import { Sparkles } from "lucide-react";
	import Badge from "./ui/badge/badge.svelte";
	import Button from "./ui/button/button.svelte";
	import CardAction from "./ui/card/card-action.svelte";
	import CardContent from "./ui/card/card-content.svelte";
	import CardDescription from "./ui/card/card-description.svelte";
	import CardFooter from "./ui/card/card-footer.svelte";
	import CardHeader from "./ui/card/card-header.svelte";
	import CardTitle from "./ui/card/card-title.svelte";
   import Card from "./ui/card/card.svelte";

</script>

<Card class="w-75 bg-neutral-900 text-white border-neutral-800 flex flex-col justify-between">
      <CardHeader>
        <div class="flex justify-between items-center">
          <span class="text-sm text-neutral-400">ChatGPT Plus</span>
          <Badge class="bg-blue-600 text-white text-[10px]">DIREKOMENDASIKAN</Badge>
        </div>
        <CardTitle class="text-2xl font-bold">Asisten AI Anda</CardTitle>
        <CardDescription class="text-neutral-400">
          Akses kecerdasan tingkat lanjut yang makin sesuai preferensi Anda.
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-6">
        <div>
          <span class="text-sm">Rp </span>
          <span class="text-3xl font-bold">349.000</span>
          <span class="text-neutral-400 text-sm"> / bulan</span>
        </div>

        <CardAction>
         <Button class="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Sparkles class="w-4 h-4 mr-2" /> Gabung Kembali ke Plus
         </Button>
        </CardAction>

        <div class="space-y-3 text-sm text-neutral-300">
          <p class="font-medium text-white">Semua yang ada di Go, ditambah:</p>
          <div class="flex items-start gap-2">
            <Check class="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
            <span>Kecerdasan tingkat lanjut untuk pekerjaan kompleks</span>
          </div>
        </div>
      </CardContent>

      <CardFooter class="text-xs text-neutral-400">
        <div class="flex items-center gap-2">
          <Check class="w-4 h-4" />
          <span>Tanpa iklan</span>
        </div>
      </CardFooter>
    </Card>

