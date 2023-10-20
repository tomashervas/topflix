export interface Movie {
    id?: string,
    idTMDB?: number,
    name: string,
    title: string,
    overview: string,
    videoUrl: string,
    thumbnailUrl: string,
    backdropUrl?: string,
    images?: string[] ,
    director?: string[],
    cast?: Cast[],
    genres?: string[],
    release_date?: string,
    vote_average?: number,
    duration?: number,
    content_rating?: string,
    budget?: number,
    revenue?: number,
    tagline?: string,
    createdAt?: Date,
    updatedAt?: Date,
  }
  
type Cast = {
    name: string,
    character: string
  }