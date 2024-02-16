export const wait = (time_ms: number) => new Promise((resolve, reject) => setTimeout(resolve, time_ms))
export const random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)
export const failed = (message: string) => { throw new Error(`\n --- Test Failed --- \n${message}\n`) }

import axios from "axios"
export const testUrl = async (url: string) => {
    try {
        const res = await axios.get(url)
        expect(res.status).toBeCloseTo(200)
        expect(res.data).toBeTruthy()
    } catch (e) {
        failed(`Url: ${url}\nError: ${e}`)
    }
}

