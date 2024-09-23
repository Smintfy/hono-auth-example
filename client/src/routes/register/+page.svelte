<script lang="ts">
	import { enhance } from '$app/forms';
	export let form;

	let username = '';
	let email = '';
	let password = '';

	$: isInputFilled = username !== '' && email !== '' && password !== '';
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
			<h1 class="font-semibold text-2xl text-[#171717] mb-2">Welcome to Acme</h1>
			<p class="text-[#A3A3A3]">
				Acme is a lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
				incididunt.
			</p>
		</header>
		<section class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<label class="text-[#737373]" for="username">Username</label>
				<input
					class="border h-[44px] p-4 rounded-xl text-[#171717] bg-white placeholder-[#A3A3A3]"
					type="text"
					id="username"
					name="username"
					placeholder="Username"
					bind:value={username}
					aria-describedby="username-error"
				/>
				<div id="username-error" aria-live="polite" aria-atomic="true" class="text-sm text-red-400">
					{#if form?.errors?.username}
						<ul>
							{#each form.errors.username as error}
								<li><span>{error}</span></li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-[#737373]" for="email">Email</label>
				<input
					class="border h-[44px] p-4 rounded-xl text-[#171717] bg-white placeholder-[#A3A3A3] focus:bg-white active:bg-white valid:bg-white"
					type="email"
					id="email"
					name="email"
					placeholder="Enter your email"
					bind:value={email}
					aria-describedby="email-error"
				/>
				<div id="email-error" aria-live="polite" aria-atomic="true" class="text-sm text-red-400">
					{#if form?.errors?.email}
						<ul>
							{#each form.errors.email as error}
								<li><span>{error}</span></li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-[#737373]" for="password">Password</label>
				<input
					class="border h-[44px] p-4 rounded-xl text-[#171717] bg-white placeholder-[#A3A3A3]"
					type="password"
					id="password"
					name="password"
					placeholder="Enter your password"
					bind:value={password}
					aria-describedby="password-error"
				/>
				<div id="password-error" aria-live="polite" aria-atomic="true" class="text-sm text-red-400">
					{#if form?.errors?.password}
						<ul>
							{#if form?.errors?.password}
								{#each form.errors.password as error}
									<li class="text-red-400"><span>{error}</span></li>
								{/each}
							{/if}
						</ul>
					{/if}
				</div>
				{#if form?.message}
					<span class="text-red-400">{form.message}</span>
				{/if}
			</div>
		</section>
		<button
			disabled={!isInputFilled}
			class="bg-[#171717] text-[#FAFAFA] h-[44px] rounded-xl disabled:text-[#737373] disabled:bg-[#EAEAEA]"
			type="submit">Sign Up</button
		>
		<span class="m-auto text-[#A3A3A3]"
			>Have an Account? <a class="text-[#737373] underline" href="/login">Log in</a></span
		>
		<span class="text-sm text-[#A3A3A3] m-auto">
			By joining, you agree to our
			<a class="underline text-[#737373]" href="/register"> Terms of Service </a> and
			<a class="underline text-[#737373]" href="/register">Privacy Policy</a>.
		</span>
	</form>
</main>
