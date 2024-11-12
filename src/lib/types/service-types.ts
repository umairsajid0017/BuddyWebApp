interface ServiceRating{
    "id": number,
    "rating": number,
    "comment": string,
    "service_id": number,
    "given_to":  number,
    "rated_by": number,
    "created_at": string,
    "updated_at": null,
    "total_likes": number
}

export type {ServiceRating }