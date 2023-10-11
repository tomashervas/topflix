import axios from "axios"
import useSWR from 'swr'

const useBillboard = () => {
    const fetcher = (url:string) => axios.get(url).then(res => res.data)
    const { data, error, isLoading } = useSWR('/api/random', fetcher)

    return {
        data,
        error,
        isLoading
    }
}

export default useBillboard