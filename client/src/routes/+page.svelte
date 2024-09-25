<script lang="ts">
	import tilt from '$lib/tilt';

	export let data;

	let element: HTMLDivElement;
	let x = 0;
	let y = 0;

	const handleShine = (e: MouseEvent) => {
		x = e.clientX - element.getBoundingClientRect().left;
		y = e.clientY - element.getBoundingClientRect().top;
		element.style.setProperty('--x', `${x}px`);
		element.style.setProperty('--y', `${y}px`);
	};
</script>

<main class="flex flex-col gap-12 justify-center items-center h-screen">
	<div
		bind:this={element}
		on:mousemove={handleShine}
		use:tilt
		class="w-[280px] h-auto shadow-tilt rounded-3xl p-6"
		role="region"
	>
		<img alt="avatar" src={`https://avatar.vercel.sh/rauch`} class="mx-auto rounded-full mb-6" />
		<header class="text-xl mb-4 font-medium text-[#171717] text-center">
			@{data.user?.username}
		</header>
		<caption class="block text-sm text-[#737373]">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit.
		</caption>
	</div>
	<a
		href="/signout"
		class="content-center bg-[#EAEAEA] font-medium text-[#A3A3A3] h-[44px] rounded-xl px-3"
	>
		Sign Out
	</a>
</main>

<style>
	.shadow-tilt {
		--tw-shadow: 0 12px 60px -16px rgb(0 0 0 / 0.25);
		--tw-shadow-colored: 0 25px 50px -12px var(--tw-shadow-color);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
			var(--tw-shadow);
	}
</style>
