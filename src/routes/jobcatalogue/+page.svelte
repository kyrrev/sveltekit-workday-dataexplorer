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

	// Create objects to store the total worker count for each job family and job family group
	const jobFamilyTotals: { [key: string]: number } = {};
	const jobFamilyGroupTotals: { [key: string]: number } = {};

	// Iterate over the job profiles to get the total worker count for each job family and job family group
	data.jobProfiles.forEach((jobProfile) => {
		const jobFamily = jobProfile.cf_CFESIJobFamily;
		const jobFamilyGroup = jobProfile.cf_CFESIJobFamilyGroup;
		const workerCount = jobProfile.workerCountWithJobProfile;

		// Update the total worker count for this job family
		if (jobFamilyTotals[jobFamily]) {
			jobFamilyTotals[jobFamily] += workerCount;
		} else {
			jobFamilyTotals[jobFamily] = workerCount;
		}

		// Update the total worker count for this job family group
		if (jobFamilyGroupTotals[jobFamilyGroup]) {
			jobFamilyGroupTotals[jobFamilyGroup] += workerCount;
		} else {
			jobFamilyGroupTotals[jobFamilyGroup] = workerCount;
		}
	});
</script>

<h1 class="text-4xl my-8">Job Profiles overview</h1>
<h2>This page fetches updated Job Profiles from Workday on each page refresh.</h2>
<h2>
	The cards include the Job Profile name, the number of workers with that Job Profile and the
	management level.
</h2>

<div class="job-profiles-container">
	{#each uniqueJobFamilyGroups as jobFamilyGroup}
		<div class="job-family-group-card">
			<h1 class="text-2xl ">{jobFamilyGroup}</h1>
			{#each uniqueJobFamilies as jobFamily, i}
				{#if jobFamilyGroups[jobFamily] === jobFamilyGroup}
					<div class="job-family-card bg-secondary">
						<h2 class="text-xl my-3">{jobFamily}</h2>
						<div class="job-profile-cards-container">
							{#each data.jobProfiles as jobProfile, i (jobProfile.cf_CFESIJobFamily + jobProfile.cf_CFESIJobFamilyGroup)}
								{#if jobProfile.cf_CFESIJobFamily === jobFamily && jobProfile.cf_CFESIJobFamilyGroup === jobFamilyGroup}
									<div
										class="job-profile-card-container card card-compact bg-neutral text-neutral-content hover:bg-neutral-focus"
									>
										<div class="job-profile-card card-body">
											<h3 class="card-title text-lg">{jobProfile.jobProfile}</h3>
											<div class="card-actions justify-end">
												<div class="badge badge-outline">{jobProfile.managementLevel}</div>
												<div class="badge badge-secondary">
													{jobProfile.workerCountWithJobProfile}
												</div>
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
