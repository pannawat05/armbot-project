export const variables = {
	PUBLIC_DUBBING_API_URL: {
		public: true,
		static: true,
		schema: {
			'~standard': {
				version: 1,
				vendor: 'armbot',
				validate: (value) => ({ value: value ?? '' })
			}
		}
	}
};
