const getDynamicConfig = () => {
	/** @type {import('next').NextConfig} */
	const config = {}

	if (process.env.DEV) {
		config.eslint = {
			ignoreDuringBuilds: true,
		}

		config.typescript = {
			ignoreBuildErrors: true,
		}
	}

	return config
}

/** @type {import('next').NextConfig} */
const nextConfig = {
	...getDynamicConfig(),
}

export default nextConfig
