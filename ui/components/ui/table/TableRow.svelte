<script lang="ts">
	import { cn } from "$lib/class-names.js";
	import { type WithElementRef } from "$lib/component-props.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableRowElement>> = $props();
</script>

<tr
	bind:this={ref}
	data-slot="table-row"
	class={cn("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors motion-reduce:transition-none has-aria-expanded:bg-muted/50", className)}
	{...restProps}
>
	{@render children?.()}
</tr>
