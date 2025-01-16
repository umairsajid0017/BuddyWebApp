import { ServiceImage } from "@/lib/types";

export const parseServiceImages = (
  images: ServiceImage[] | string | undefined | null,
): ServiceImage[] => {
  if (!images) return [];

  if (typeof images === "string") {
    try {
      return JSON.parse(images);
    } catch {
      return [];
    }
  }

  return images;
};

export const getImageUrl = (name: string) => {
  if (name.startsWith("http")) {
    return name;
  }
  return `${process.env.NEXT_PUBLIC_IMAGE_URL}/${name}`;
};
