import { useUpdateLocation } from "@/lib/api/bookings";

export interface Location {
  latitude: string;
  longitude: string;
}

export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        reject(error);
      },
    );
  });
};

export const useLocationUpdate = () => {
  const updateLocation = useUpdateLocation();

  const updateUserLocation = async () => {
    try {
      const location = await getCurrentLocation();
      await updateLocation.mutateAsync(location);
      return true;
    } catch (error) {
      console.error("Error updating location:", error);
      throw error;
    }
  };

  return {
    updateUserLocation,
    isUpdating: updateLocation.isLoading,
  };
};
