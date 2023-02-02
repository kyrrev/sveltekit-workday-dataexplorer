<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;

	// Get all unique job family groups
	const uniqueJobFamilyGroups = [
		...new Set(data.jobProfiles.map((jobProfile) => jobProfile.cf_CFESIJobFamilyGroup))
	];
	// Get all unique job families
	const uniqueJobFamilies = [
		...new Set(data.jobProfiles.map((jobProfile) => jobProfile.cf_CFESIJobFamily))
	];
	//Create a jobFamilyGroups object
	const jobFamilyGroups: { [key: string]: string } = {};
	data.jobProfiles.forEach((jobProfile) => {
		jobFamilyGroups[jobProfile.cf_CFESIJobFamily] = jobProfile.cf_CFESIJobFamilyGroup;
	});

	// Reactive variable to hold selected job family group (string)
	let selectedJobFamilyGroup: string = 'All';
</script>

<h1 class="text-4xl my-8">Job Profiles overview</h1>
<h2>This page fetches updated Job Profiles from Workday on each page refresh.</h2>
<h2>
	The cards include the Job Profile name, the number of workers with that Job Profile and the
	management level.
</h2>
<div class="flex gap-8">
	<div class="stats stats-vertical lg:stats-horizontal shadow my-3">
		<div class="stat bg-primary">
			<div class="stat-title">Job Family Groups</div>
			<div class="stat-value">{uniqueJobFamilyGroups.length}</div>
		</div>
		<div class="stat bg-secondary">
			<div class="stat-title">Job Families</div>
			<div class="stat-value">{uniqueJobFamilies.length}</div>
		</div>
		<div class="stat bg-neutral">
			<div class="stat-title">Job Profiles</div>
			<div class="stat-value">{data.jobProfiles.length}</div>
		</div>
	</div>
	<div class=" my-8 mb-10 justify-end">
		<select bind:value={selectedJobFamilyGroup} class="select select-primary w-full max-w-xs">
			<option value="All">All</option>
			{#each uniqueJobFamilyGroups as group}
				<option value={group}>{group}</option>
			{/each}
		</select>
	</div>

	selected value {selectedJobFamilyGroup}
</div>
<div class="job-profiles-container">
	{#each uniqueJobFamilyGroups as jobFamilyGroup}
		{#if selectedJobFamilyGroup === 'All' || selectedJobFamilyGroup === jobFamilyGroup}
			<div class="job-family-group-card">
				<h1 class="text-2xl ">{jobFamilyGroup}</h1>
				{#each uniqueJobFamilies as jobFamily, i}
					{#if jobFamilyGroups[jobFamily] === jobFamilyGroup}
						<div class="job-family-card bg-secondary">
							<h2 class="text-xl my-3">{jobFamily}</h2>
							<div class="job-profile-cards-container">
								<!-- something in here breaks the binding for the select.. -->
								{#each data.jobProfiles as jobProfile, i (jobProfile.cf_CFESIJobFamily + jobProfile.cf_CFESIJobFamilyGroup)}
									{#if jobProfile.cf_CFESIJobFamily === jobFamily && jobProfile.cf_CFESIJobFamilyGroup === jobFamilyGroup}
										<div
											class="job-profile-card-container card card-compact bg-neutral text-neutral-content hover:bg-neutral-focus"
										>
											<div class="job-profile-card card-body">
												<h3 class="card-title text-base">{jobProfile.jobProfile}</h3>
												<div class="card-actions justify-end">
													<div class="badge badge-outline">{jobProfile.managementLevel}</div>
													{#if jobProfile.workerCountWithJobProfile === 0}
														<div class="badge badge-error">
															{jobProfile.workerCountWithJobProfile}
														</div>
													{:else if jobProfile.workerCountWithJobProfile < 5}
														<div class="badge badge-warning">
															{jobProfile.workerCountWithJobProfile}
														</div>
													{:else}
														<div class="badge badge-success">
															{jobProfile.workerCountWithJobProfile}
														</div>
													{/if}
												</div>
											</div>
										</div>
									{/if}
								{/each}
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{/if}
	{/each}
</div>

<style lang="postcss">
	.job-family-group-card {
		background-color: hsl(var(--p));
		padding: 20px;
		margin: 10px;
		border-radius: 10px;
		min-height: 50px;
	}

	.job-family-card {
		display: grid;
		//background-color: hsl(var(--pc));
		padding: 10px;
		margin: 10px;
		border: 5px solid hsl(var(--s));
		border-radius: 10px;
	}
	.job-profile-cards-container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(auto-fill, 1fr);
		grid-column-gap: 10px;
		grid-row-gap: 10px;
	}
	.job-profile-card-container {
		//grid-column: span 1;
		//grid-row: span 1;
	}

	.job-profile-card {
		//border: 3px solid hsl(var(--a));
		//background-color: hsl(var(--s));
	}
</style>
