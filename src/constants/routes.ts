export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    VERIFY_EMAIL: "/verify-email",


    CATEGORIES: "/categories",
    SERVICES: "/services",

    
}

export const getCategoryRoute = (categorySlug: string, categoryId: number) => {
    return `${ROUTES.CATEGORIES}/${categorySlug}?id=${categoryId}`;
}

export const getServiceRoute = (serviceId: string) => {
    return `${ROUTES.SERVICES}/${serviceId}`;
}

