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
</script>

<h1 class="text-4xl text-center my-8">Job Profiles overview</h1>
<h2>This page fetches updated Job Profiles from Workday on each page refresh.</h2>
<h2>
	The cards include the Job Profile name, the number of workers with that Job Profile and the
	management level.
</h2>

<div class="job-profiles-container">
	{#each uniqueJobFamilyGroups as jobFamilyGroup}
		<div class="job-family-group-card">
			<h1>{jobFamilyGroup}</h1>
			{#each uniqueJobFamilies as jobFamily, i}
				{#if jobFamilyGroups[jobFamily] === jobFamilyGroup}
					<div class="job-family-card">
						<h2>{jobFamily}</h2>
						<div class="job-profile-cards-container">
							{#each data.jobProfiles as jobProfile, i (jobProfile.cf_CFESIJobFamily + jobProfile.cf_CFESIJobFamilyGroup)}
								{#if jobProfile.cf_CFESIJobFamily === jobFamily && jobProfile.cf_CFESIJobFamilyGroup === jobFamilyGroup}
									<div class="job-profile-card-container">
										<div class="job-profile-card">
											<p><strong>{jobProfile.jobProfile}</strong></p>
											<p>{jobProfile.workerCountWithJobProfile} and {jobProfile.managementLevel}</p>
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
		background-color: #c8c8c8;
		padding: 20px;
		margin: 10px;
		border-radius: 10px;
		min-height: 50px;
	}

	.job-family-card {
		display: grid;
		background-color: #d8d8d8;
		padding: 10px;
		margin: 10px;
		border-radius: 10px;
		box-shadow: 0px 0px 5px #ccc;
	}
	.job-profile-cards-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(auto-fill, 1fr);
		grid-column-gap: 10px;
		grid-row-gap: 10px;
	}
	.job-profile-card-container {
		grid-column: span 1;
		grid-row: span 1;
	}

	.job-profile-card {
		height: fit-content;
		border: 1px solid #ccc;
		padding: 10px;
		background-color: #e8e8e8;
		border-radius: 10px;
	}
</style>
