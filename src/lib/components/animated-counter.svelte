<script lang="ts">
    let {
        value, 
        duration = 800,
        formatFunction = (n : number) => n.toLocaleString(),
    } : {
        value : number;
        duration? : number;
        formatFunction?: (n:number) => string;
    } = $props()

    let display = $state("0")

    $effect( 
        () => {
            const target = value;
            const start = performance.now(); 
            let frame : number;

            function easeOutExponential (t : number) : number {
                return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
            }
            
            function animate(now: number) {
			const elapsed = now - start;
			const progress = Math.min(elapsed / duration, 1);
			const eased = easeOutExponential(progress);
			const current = Math.round(eased * target);
			display = formatFunction(current);

			if (progress < 1) {
				frame = requestAnimationFrame(animate);
			}
		}

		frame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(frame);
        }
    );
</script>

{display}