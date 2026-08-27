import {
	CONTACT_TYPE,
	PERSON_ALTERNATE_NAMES,
	PERSON_DESCRIPTION,
	PERSON_EMAIL,
	PERSON_JOB_TITLE,
	PERSON_NAME,
	POSTAL_ADDRESS,
	SITE_DESCRIPTION,
	SITE_TITLE,
	SITE_URL,
	socialLinks,
} from "../data/index.ts";

const PERSON_ID = `${SITE_URL}/#person`;
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function sameAsUrls(): string[] {
	return socialLinks.map((link) => link.url);
}

export function buildIdentityJsonLd() {
	const sameAs = sameAsUrls();

	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebSite",
				"@id": WEBSITE_ID,
				name: SITE_TITLE,
				url: `${SITE_URL}/`,
				description: SITE_DESCRIPTION,
				publisher: { "@id": PERSON_ID },
			},
			{
				"@type": "Person",
				"@id": PERSON_ID,
				name: PERSON_NAME,
				alternateName: [...PERSON_ALTERNATE_NAMES],
				url: `${SITE_URL}/`,
				email: PERSON_EMAIL,
				description: PERSON_DESCRIPTION,
				jobTitle: PERSON_JOB_TITLE,
				image: `${SITE_URL}/images/ogimage.png`,
				sameAs,
				worksFor: { "@id": ORGANIZATION_ID },
			},
			{
				"@type": "Organization",
				"@id": ORGANIZATION_ID,
				name: SITE_TITLE,
				url: `${SITE_URL}/`,
				email: PERSON_EMAIL,
				description: SITE_DESCRIPTION,
				founder: { "@id": PERSON_ID },
				sameAs,
				contactPoint: {
					"@type": "ContactPoint",
					email: PERSON_EMAIL,
					contactType: CONTACT_TYPE,
				},
				address: {
					"@type": "PostalAddress",
					addressLocality: POSTAL_ADDRESS.addressLocality,
					addressRegion: POSTAL_ADDRESS.addressRegion,
					addressCountry: POSTAL_ADDRESS.addressCountry,
				},
			},
		],
	};
}
