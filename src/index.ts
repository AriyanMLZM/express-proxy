import express, { Request, Response } from 'express'
import axios from 'axios'

const app = express()

// Proxy endpoint
app.get('/proxy', async (req: Request, res: Response) => {
	const { url } = req.query

	if (!url) {
		res.status(400).send('URL parameter is required')
		return
	}

	try {
		const response = await axios.get(url as string, {
			responseType: 'arraybuffer',
		})

		// Forward headers (optional)
		const contentType = response.headers['content-type']
		if (contentType) {
			res.setHeader('Content-Type', contentType)
		}

		res.status(200).send(response.data)
	} catch (error) {
		console.error('Proxy error:', error)
		res.status(500).send('Failed to fetch image')
	}
})

// Health check
app.get('/', (req: Request, res: Response) => {
	res.send('Image Proxy is running 🚀')
})

// Export for Vercel
export default app

// Local server (only for development)
if (process.env.NODE_ENV !== 'production') {
	const PORT = process.env.PORT || 4000
	app.listen(PORT, () => {
		console.log(`Server running on http://localhost:${PORT}`)
	})
}
