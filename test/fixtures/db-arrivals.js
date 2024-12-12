const dbArrivals = [
	{
		tripId: '20241208-c33bba6c-a73a-3eec-8a64-76356c922ece',
		stop: {
			type: 'stop',
			id: '8089100',
			name: 'Berlin Jungfernheide (S)',
			location: null,
		},
		when: '2024-12-08T01:00:00+01:00',
		plannedWhen: '2024-12-08T01:00:00+01:00',
		delay: null,
		platform: '6',
		plannedPlatform: '6',
		direction: null,
		provenance: 'Berlin Beusselstraße',
		line: {
			type: 'line',
			id: 's-42-42323',
			fahrtNr: '42323',
			name: 'S 42 (42323)',
			public: true,
			productName: 'S',
			mode: 'train',
			product: 'suburban',
			operator: null,
		},
		remarks: [
			{
				code: 'FB',
				summary: 'Fahrradmitnahme begrenzt möglich',
				text: 'Fahrradmitnahme begrenzt möglich',
				type: 'hint',
			},
		],
		origin: {
			type: 'stop',
			id: '8089118',
			name: 'Berlin Beusselstraße',
			location: null,
		},
		destination: null,
	},
	{
		tripId: '20241208-89eeca5a-1768-3713-894a-dd088977f42b',
		stop: {
			type: 'stop',
			id: '730985',
			name: 'Jungfernheide Bahnhof (S+U), Berlin',
			location: null,
		},
		when: '2024-12-08T01:00:00+01:00',
		plannedWhen: '2024-12-08T01:00:00+01:00',
		delay: null,
		platform: null,
		plannedPlatform: null,
		direction: null,
		provenance: 'Rudow (U), Berlin',
		line: {
			type: 'line',
			id: 'u-7-15421',
			fahrtNr: '15421',
			name: 'U 7 (15421)',
			public: true,
			productName: 'U',
			mode: 'train',
			product: 'subway',
			operator: null,
		},
		remarks: [
			{
				code: 'FB',
				summary: 'Fahrradmitnahme begrenzt möglich',
				text: 'Fahrradmitnahme begrenzt möglich',
				type: 'hint',
			},
			{
				code: 'RG',
				summary: 'Behindertengerechtes Fahrzeug',
				text: 'Behindertengerechtes Fahrzeug',
				type: 'hint',
			},
		],
		origin: {
			type: 'stop',
			id: '732218',
			name: 'Rudow (U), Berlin',
			location: null,
		},
		destination: null,
	},
	{
		tripId: '20241208-2dc4f2d4-a1e1-3bbf-a607-98ff71c927d0',
		stop: {
			type: 'stop',
			id: '730985',
			name: 'Jungfernheide Bahnhof (S+U), Berlin',
			location: null,
		},
		when: '2024-12-08T01:03:00+01:00',
		plannedWhen: '2024-12-08T01:03:00+01:00',
		delay: null,
		platform: null,
		plannedPlatform: null,
		direction: null,
		provenance: 'Goerdelersteg, Berlin',
		line: {
			type: 'line',
			id: 'bus-m21-93424',
			fahrtNr: '93424',
			name: 'Bus M21 (93424)',
			public: true,
			productName: 'Bus',
			mode: 'bus',
			product: 'bus',
			operator: null,
		},
		remarks: [
			{
				code: 'NF',
				summary: 'keine Fahrradbeförderung möglich',
				text: 'keine Fahrradbeförderung möglich',
				type: 'hint',
			},
			{
				code: 'RG',
				summary: 'Behindertengerechtes Fahrzeug',
				text: 'Behindertengerechtes Fahrzeug',
				type: 'hint',
			},
		],
		origin: {
			type: 'stop',
			id: '730993',
			name: 'Goerdelersteg, Berlin',
			location: null,
		},
		destination: null,
	},
	{
		tripId: '20241208-6fa6d37c-a1c0-3f84-bdac-0424705bffaf',
		stop: {
			type: 'stop',
			id: '8089100',
			name: 'Berlin Jungfernheide (S)',
			location: null,
		},
		when: '2024-12-08T01:05:00+01:00',
		plannedWhen: '2024-12-08T01:05:00+01:00',
		delay: null,
		platform: '5',
		plannedPlatform: '5',
		direction: null,
		provenance: 'Berlin Beusselstraße',
		line: {
			type: 'line',
			id: 's-41-41254',
			fahrtNr: '41254',
			name: 'S 41 (41254)',
			public: true,
			productName: 'S',
			mode: 'train',
			product: 'suburban',
			operator: null,
		},
		remarks: [
			{
				code: 'FB',
				summary: 'Fahrradmitnahme begrenzt möglich',
				text: 'Fahrradmitnahme begrenzt möglich',
				type: 'hint',
			},
		],
		origin: {
			type: 'stop',
			id: '8089118',
			name: 'Berlin Beusselstraße',
			location: null,
		},
		destination: null,
	},
	{
		tripId: '20241208-c4abf007-d667-3bf1-87a8-2d1b153c014d',
		stop: {
			type: 'stop',
			id: '730985',
			name: 'Jungfernheide Bahnhof (S+U), Berlin',
			location: null,
		},
		when: '2024-12-08T01:10:00+01:00',
		plannedWhen: '2024-12-08T01:10:00+01:00',
		delay: null,
		platform: null,
		plannedPlatform: null,
		direction: null,
		provenance: 'Rudow (U), Berlin',
		line: {
			type: 'line',
			id: 'u-7-15422',
			fahrtNr: '15422',
			name: 'U 7 (15422)',
			public: true,
			productName: 'U',
			mode: 'train',
			product: 'subway',
			operator: null,
		},
		remarks: [
			{
				code: 'FB',
				summary: 'Fahrradmitnahme begrenzt möglich',
				text: 'Fahrradmitnahme begrenzt möglich',
				type: 'hint',
			},
			{
				code: 'RG',
				summary: 'Behindertengerechtes Fahrzeug',
				text: 'Behindertengerechtes Fahrzeug',
				type: 'hint',
			},
		],
		origin: {
			type: 'stop',
			id: '732218',
			name: 'Rudow (U), Berlin',
			location: null,
		},
		destination: null,
	},
	{
		tripId: '20241208-c8b6e3e4-6acb-3237-b89e-1fca72497555',
		stop: {
			type: 'stop',
			id: '8089100',
			name: 'Berlin Jungfernheide (S)',
			location: null,
		},
		when: '2024-12-08T01:10:00+01:00',
		plannedWhen: '2024-12-08T01:10:00+01:00',
		delay: null,
		platform: '6',
		plannedPlatform: '6',
		direction: null,
		provenance: 'Berlin Beusselstraße',
		line: {
			type: 'line',
			id: 's-42-42325',
			fahrtNr: '42325',
			name: 'S 42 (42325)',
			public: true,
			productName: 'S',
			mode: 'train',
			product: 'suburban',
			operator: null,
		},
		remarks: [
			{
				code: 'FB',
				summary: 'Fahrradmitnahme begrenzt möglich',
				text: 'Fahrradmitnahme begrenzt möglich',
				type: 'hint',
			},
		],
		origin: {
			type: 'stop',
			id: '8089118',
			name: 'Berlin Beusselstraße',
			location: null,
		},
		destination: null,
	},
	{
		tripId: '20241208-f9d83ab7-d603-3344-87c0-a65ecf0f8524',
		stop: {
			type: 'stop',
			id: '730985',
			name: 'Jungfernheide Bahnhof (S+U), Berlin',
			location: null,
		},
		when: '2024-12-08T01:10:00+01:00',
		plannedWhen: '2024-12-08T01:10:00+01:00',
		delay: null,
		platform: null,
		plannedPlatform: null,
		direction: null,
		provenance: 'Rathaus Spandau (S+U), Berlin',
		line: {
			type: 'line',
			id: 'u-7-15752',
			fahrtNr: '15752',
			name: 'U 7 (15752)',
			public: true,
			productName: 'U',
			mode: 'train',
			product: 'subway',
			operator: null,
		},
		remarks: [
			{
				code: 'FB',
				summary: 'Fahrradmitnahme begrenzt möglich',
				text: 'Fahrradmitnahme begrenzt möglich',
				type: 'hint',
			},
			{
				code: 'RG',
				summary: 'Behindertengerechtes Fahrzeug',
				text: 'Behindertengerechtes Fahrzeug',
				type: 'hint',
			},
		],
		origin: {
			type: 'stop',
			id: '731176',
			name: 'Rathaus Spandau (S+U), Berlin',
			location: null,
		},
		destination: null,
	},
];

export {
	dbArrivals,
};
