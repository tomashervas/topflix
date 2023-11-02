
export const getRatingColor = (rating: string) => {
    if(rating == "APTA") return "#22c55e"
    if(rating == "TP") return "#22c55e"
    if(+rating < 6) return "#22c55e"
    if(+rating < 8) return "#0ea5e9"
    if(+rating < 14) return "#facc15"
    if(+rating <= 17) return "#f97316"
    if (+rating > 17) return "#dc2626"
    
    return "bg-gray-500"

}