import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

export const getRatingColor = (rating: number) => {
    if (+rating < 6) return "#22c55e"
    if (+rating < 8) return "#0ea5e9"
    if (+rating < 14) return "#facc15"
    if (+rating <= 17) return "#f97316"
    if (+rating > 17) return "#dc2626"

    return "bg-gray-500"

}

export const saveProfileLocal = (router: AppRouterInstance, name: string, imgUrl: string, limitedAge: number) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 90);
    localStorage.setItem('profile', JSON.stringify({ name, imgUrl, limitedAge }))
    document.cookie = `limitedAge=${limitedAge}; path=/; expires=${expirationDate.toUTCString()}`
    router.push(process.env.NEXT_PUBLIC_DOMAIN_URL + '/')
}


export const getColorsImg = async (vibrant:any ,imgUrl: string, limitedAge: number) => {
    let colorA = limitedAge < 12 ? '#1d4ed8' : '#18181b'
    let colorB = limitedAge < 12 ? '#1d4ed8' : '#18181b'

    try {
        const palette = await vibrant.from(imgUrl).getPalette()
        const arrayPalette = Object.values(palette)
        // @ts-ignore
        const sortedArray = arrayPalette.sort((a, b) => b!.population - a!.population)
        // @ts-ignore
        colorA = sortedArray[0]?.hex!
        // @ts-ignore
        colorB = sortedArray[1]?.hex!

    } catch (error) {
        console.log(error)
    }

    return [colorA, colorB]
}