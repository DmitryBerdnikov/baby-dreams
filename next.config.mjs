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
	experimental: {
		serverActions: {
			// browser-sync external url
			allowedOrigins: ['localhost', '192.168.0.125:3001']
		}
	}
}

export default nextConfig
