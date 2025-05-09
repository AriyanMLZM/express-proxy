import express, { Request, Response } from 'express'
import axios from 'axios'

const app = express()

// Proxy endpoint
app.all('/proxy', async (req: Request, res: Response) => {
	const targetUrl = req.query.url

	if (!targetUrl) {
		res.status(400).send('url parameter is required')
		return
	}

	try {
		const response = await axios({
			method: req.method,
			url: targetUrl as string,
			data: req.body,
			responseType: 'arraybuffer',
		})

		// set header
		const contentType = response.headers['content-type']
		if (contentType) {
			res.setHeader('Content-Type', contentType)
		}

		// send data
		res.status(200).send(response.data)
	} catch (error) {
		console.error('Proxy error:', error)
		res.status(500).send('Failed to fetch data')
	}
})

app.get('/', (req: Request, res: Response) => {
	res.send('Proxy is running 🚀')
})

// Local server (only for development)
if (process.env.NODE_ENV !== 'production') {
	const PORT = process.env.PORT || 4000
	app.listen(PORT, () => {
		console.log(`Server running on http://localhost:${PORT}`)
	})
}

// Export for Vercel
export default app
