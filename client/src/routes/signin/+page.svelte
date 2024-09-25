<script>
	import { enhance } from '$app/forms';
	export let form;

	let email = '';
	let password = '';

	$: isFormFilled = email !== '' && password !== '';
</script>

<main class="flex items-center min-h-screen h-auto md:h-screen justify-center px-4 py-8 md:p-0">
	<form
		method="POST"
		use:enhance={() => {
			return async ({ update }) => {
				update({ reset: false });
			};
		}}
		class="flex flex-col gap-8 p-8 w-full sm:w-[496px] bg-[#F5F5F5] rounded-3xl"
	>
		<header>
			<h1 class="font-semibold text-2xl text-[#171717] mb-2">Welcome Back!</h1>
			<p class="text-[#A3A3A3]">
				Acme is a lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
				incididunt.
			</p>
		</header>
		<section class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<label class="text-[#737373] select-none pointer-events-none" for="email">Email</label>
				<input
					class="border h-[44px] p-4 rounded-xl text-[#171717] bg-white placeholder-[#A3A3A3] transition-colors duration-200 w"
					type="email"
					id="email"
					name="email"
					placeholder="Enter your email"
					bind:value={email}
				/>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-[#737373] select-none pointer-events-none" for="password">
					Password
				</label>
				<div class="relative">
					<input
						class="border h-[44px] p-4 rounded-xl text-[#171717] bg-white placeholder-[#A3A3A3] transition-colors duration-200 w-full"
						id="password"
						name="password"
						type="password"
						placeholder="Enter your password"
						bind:value={password}
					/>
				</div>
				{#if form?.message}
					<span class="text-red-400">{form.message}</span>
				{/if}
			</div>
		</section>
		<button
			class="bg-[#171717] font-medium text-[#FAFAFA] h-[44px] rounded-xl disabled:text-[#A3A3A3] disabled:bg-[#EAEAEA] disabled:cursor-not-allowed"
			type="submit"
			disabled={!isFormFilled}
		>
			Sign In
		</button>
		<span class="m-auto text-[#A3A3A3]">
			Don't have an Account?
			<a class="text-[#737373] underline" href="/signup">Sign Up</a>
		</span>
		<span class="text-sm text-[#A3A3A3] m-auto">
			By joining, you agree to our
			<a class="underline text-[#737373]" href="/register"> Terms of Service </a> and
			<a class="underline text-[#737373]" href="/register">Privacy Policy</a>.
		</span>
	</form>
</main>
