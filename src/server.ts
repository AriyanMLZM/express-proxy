import express, { Request, Response } from 'express'
import axios from 'axios'
import cors from 'cors'

const app = express()

app.use(cors())

app.all('/proxy', async (req: Request, res: Response) => {
	const targetUrl = req.query.url as string

	if (!targetUrl) {
		res.status(400).send('url parameter is required')
		return
	}

	try {
		const response = await axios({
			method: req.method,
			url: targetUrl,
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

app.get('/', (_, res: Response) => {
	res.send('Proxy is running 🚀')
})

// Local server (only for development)
if (process.env.NODE_ENV !== 'production') {
	const PORT = 4000
	app.listen(PORT, () => {
		console.log(`Server running on Port ${PORT}`)
	})
}

// Export for Vercel
export default app
