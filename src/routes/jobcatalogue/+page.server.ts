// Importing environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.BASE_URL;
const TOKEN_ENDPOINT = process.env.TOKEN_ENDPOINT ?? 'default_token_endpoint';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const QUERY_PARAM = process.env.QUERY_PARAM;

// Defining the interface for the data

interface JobProfile {
	cf_CFESIJobFamilyGroup: string;
	cf_CFESIJobFamilyGroupID: string;
	cf_CFESIJobFamily: string;
	cf_CFESIJobFamilyID: string;
	jobProfile: string;
	jobProfileID: string;
	managementLevel: string;
	workerCountWithJobProfile: number;
}

// This async function gets API data and returns it
export async function load(): Promise<{ jobProfiles: JobProfile[] }> {
	try {
		// Fetch access token from token endpoint
		const token_response = await fetch(TOKEN_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
			},
			body: 'grant_type=refresh_token&refresh_token=' + REFRESH_TOKEN
		});
		const token_data = await token_response.json();
		const access_token = token_data.access_token;
		let jobProfilesRaw: any[] = [];
		let total = 0;
		const limit = 100;
		let offset = 0;
		while (total === 0 || offset < total) {
			// Fetching data from API at BASE_URL with query parameters and access token
			const response = await fetch(
				BASE_URL + '/data?' + '&limit=' + limit + '&offset=' + offset + '&query=' + QUERY_PARAM,
				{
					method: 'GET',
					headers: {
						Authorization: 'Bearer ' + access_token
					}
				}
			);
			if (!response.ok) {
				console.log('response:', response);
				console.log('response text:', await response.text());
				throw new Error(`Failed to fetch API data (HTTP status ${response.status})`);
			}
			const data = await response.json();

			jobProfilesRaw = jobProfilesRaw.concat(data.data);
			total = data.total;
			offset += limit;
		}

		// Mapping the data to a flat structure and removing the IDs
		const jobProfiles: JobProfile[] = jobProfilesRaw.map((item) => {
			return {
				cf_CFESIJobFamilyGroup: item.cf_CFESIJobFamilyGroup?.descriptor || 'Uncategorized',
				cf_CFESIJobFamilyGroupID: item.cf_CFESIJobFamilyGroup?.id || '',
				cf_CFESIJobFamily: item.cf_CFESIJobFamily?.descriptor || 'Uncategorized',
				cf_CFESIJobFamilyID: item.cf_CFESIJobFamily?.id || '',
				jobProfile: item.jobProfile?.descriptor || '',
				jobProfileID: item.jobProfile?.id || '',
				managementLevel: item.managementLevel?.descriptor || '',
				workerCountWithJobProfile: item.workerCountWithJobProfile || 0
			};
		});
		return { jobProfiles };
	} catch (error) {
		console.error(error);
		throw new Error('Failed to load data');
	}
}
