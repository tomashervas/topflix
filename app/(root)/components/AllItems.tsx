import { Movie, TVShow } from "@prisma/client"
import Card from "./Card"
import LoadMoreItems from "./LoadMoreItems"

interface AllItemsProps {
    items: Movie[] | TVShow[]
    isMovie: boolean
}
const AllItems = ({ items, isMovie }: AllItemsProps) => {
    return (
        <>
            {items ? items.map((item) => (
                <Card key={item.id} item={item} isMovie={isMovie} grid/>
            ))
                : <div className="text-xl font-bold">No Hay items </div>
            }
        </>

    )
}
export default AllItems