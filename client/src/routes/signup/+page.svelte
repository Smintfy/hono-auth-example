<script lang="ts">
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import {
		IconCircle,
		IconCircleCheckFilled,
		IconEye,
		IconEyeOff
	} from '@tabler/icons-svelte/icons';

	export let form;

	type FieldState = {
		value: string;
		error: string;
		touched: boolean;
		validated: boolean;
	};

	let username: FieldState = { value: '', error: '', touched: false, validated: false };
	let email: FieldState = { value: '', error: '', touched: false, validated: false };
	let password: FieldState = { value: '', error: '', touched: false, validated: false };

	let showPasswordRequirements = false;
	let showPassword = false;

	const togglePasswordVisibility = () => {
		showPassword = !showPassword;
	};

	const usernameRequirement = /^[a-zA-Z0-9_]+$/;
	const emailRequirement = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	const passwordRequirements = [
		{ regex: /[0-9]/, message: 'At least one number' },
		{ regex: /[A-Z]/, message: 'At least one uppercase letter' },
		{ regex: /[#?!@$%^&*-]/, message: 'At least one special character' },
		{ regex: /.{8,}/, message: '8 characters long or more' }
	];

	const isAllPasswordRequirementsMet = () => {
		return passwordRequirements.every((req) => req.regex.test(password.value));
	};

	const validateField = (name: string, value: string) => {
		switch (name) {
			case 'username':
				if (value.length < 4) {
					return 'Username must be at least 4 character long';
				}
				if (value.length > 20) {
					return 'Username cannot exceed 20 characters';
				}
				if (!usernameRequirement.test(value)) {
					return 'Username can only contain letters, numbers, and underscores.';
				}
				return '';
			case 'email':
				return !emailRequirement.test(value) ? 'Invalid email' : '';
			case 'password':
				return value.length < 8
					? 'Password must be at least 8 characters long'
					: value.length > 20
						? 'Password cannot exceed 20 characters long'
						: '';
			default:
				return '';
		}
	};

	const handleBlur = (e: Event) => {
		const { name, value } = e.target as HTMLInputElement;
		const error = validateField(name, value);

		switch (name) {
			case 'username':
				username = { ...username, error, touched: true, validated: true };
				break;
			case 'email':
				email = { ...email, error, touched: true, validated: true };
				break;
			case 'password':
				password = { ...password, error, touched: true, validated: true };
				break;
		}
	};

	const handleChange = (e: Event) => {
		const { name, value } = e.target as HTMLInputElement;

		switch (name) {
			case 'username':
				username = { ...username, value };
				if (username.validated) {
					username.error = validateField(name, value);
				}
				break;
			case 'email':
				email = { ...email, value };
				if (email.validated) {
					email.error = validateField(name, value);
				}
				break;
			case 'password':
				password = { ...password, value };
				if (!showPasswordRequirements && value.length > 0) {
					showPasswordRequirements = true;
				} else if (showPasswordRequirements && value.length === 0) {
					showPasswordRequirements = false;
				}
				break;
			default:
				return;
		}
	};

	// Used to disable the button if all the input is have yet to be filled or validated.
	$: isFormValid = () => {
		return (
			username.value.length >= 4 &&
			username.value.length <= 20 &&
			emailRequirement.test(email.value) &&
			passwordRequirements.every((req) => req.regex.test(password.value))
		);
	};

	// base class for the input fields.
	$: inputBaseClass = (fieldState: FieldState, isPassword = false) => {
		let baseClasses =
			'border h-[44px] p-4 rounded-xl text-[#171717] bg-white placeholder-[#A3A3A3] transition-colors duration-200';
		if (fieldState.touched && fieldState.validated) {
			if (fieldState.error || (isPassword && !isAllPasswordRequirementsMet())) {
				return `${baseClasses} focus:outline-red-500 border-red-500 focus:border-red-500 bg-red-50`;
			}
		}
		return baseClasses;
	};
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
				<label class="text-[#737373] select-none pointer-events-none" for="username">Username</label
				>
				<input
					class={inputBaseClass(username)}
					type="text"
					id="username"
					name="username"
					placeholder="Username"
					on:input={handleChange}
					on:blur={handleBlur}
					bind:value={username.value}
					aria-invalid={username.touched && !!username.error}
					aria-describedby="username-error"
				/>
				<div id="username-error" aria-live="polite" aria-atomic="true" class="text-sm text-red-400">
					{#if username.error}
						<span>{username.error}</span>
					{/if}
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-[#737373] select-none pointer-events-none" for="email">Email</label>
				<input
					class={inputBaseClass(email)}
					type="email"
					id="email"
					name="email"
					placeholder="Enter your email"
					on:input={handleChange}
					on:blur={handleBlur}
					bind:value={email.value}
					aria-invalid={email.touched && !!email.error}
					aria-describedby="email-error"
				/>
				<div id="email-error" aria-live="polite" aria-atomic="true" class="text-sm text-red-400">
					{#if email.error}
						<span>{email.error}</span>
					{/if}
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-[#737373] select-none pointer-events-none" for="password">
					Password
				</label>
				<div class="relative">
					<input
						class={`${inputBaseClass(password, true)} w-full`}
						id="password"
						name="password"
						type={showPassword ? 'text' : 'password'}
						value={password.value}
						on:input={handleChange}
						placeholder="Enter your password"
						on:blur={handleBlur}
						aria-invalid={password.touched && !!password.validated}
						aria-describedby="password-error"
					/>
					<button
						type="button"
						on:click={togglePasswordVisibility}
						aria-label={showPassword ? 'Hide password' : 'Show password'}
						class="flex justify-center items-center absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 hover:bg-black hover:bg-opacity-5 rounded-lg"
					>
						{#if showPassword}
							<IconEyeOff size={24} stroke={1.75} class="text-[#A3A3A3] hover:text-[#737373]" />
						{:else}
							<IconEye size={24} stroke={1.75} class="text-[#A3A3A3] hover:text-[#737373]" />
						{/if}
					</button>
				</div>
				<div id="password-error" aria-live="polite" aria-atomic="true" class="text-sm text-red-400">
					{#if password.error}
						<span transition:slide={{ duration: 300 }}>{password.error}</span>
					{/if}
				</div>
				{#if showPasswordRequirements}
					<div transition:slide={{ duration: 300 }}>
						<ul id="password-requirements" class="text-sm space-y-1">
							{#each passwordRequirements as req}
								<li
									class={`flex gap-1 items-center ${req.regex.test(password.value) ? 'text-[#737373]' : 'text-[#A3A3A3]'}`}
								>
									{#if req.regex.test(password.value)}
										<IconCircleCheckFilled size={16} stroke={1.5} />
									{:else}
										<IconCircle size={16} stroke={1.5} />
									{/if}
									{req.message}
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#if form?.message}
					<span class="text-red-400">{form.message}</span>
				{/if}
			</div>
		</section>
		<button
			disabled={!isFormValid()}
			class="bg-[#171717] font-medium text-[#FAFAFA] h-[44px] rounded-xl disabled:text-[#A3A3A3] disabled:bg-[#EAEAEA] disabled:cursor-not-allowed"
			type="submit"
		>
			Sign Up
		</button>
		<span class="m-auto text-[#A3A3A3]">
			Have an Account?
			<a class="text-[#737373] underline" href="/signin">Sign In</a>
		</span>
		<span class="text-sm text-[#A3A3A3] m-auto">
			By joining, you agree to our
			<a class="underline text-[#737373]" href="/register"> Terms of Service </a> and
			<a class="underline text-[#737373]" href="/register">Privacy Policy</a>.
		</span>
	</form>
</main>
