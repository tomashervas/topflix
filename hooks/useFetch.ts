import axios from "axios"
import useSWR from 'swr'

const useFetch = (apiUrl:string) => {
    const fetcher = (url:string) => axios.get(url).then(res => res.data)
    const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false
    })

    return {
        data,
        error,
        isLoading
    }
}

export default useFetch