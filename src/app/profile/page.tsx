"use client";
import UserProfile from "@/components/account/user-profile-component";
import PopularServicesSection from "@/components/services/popular-services-section";
import Loading from "@/components/ui/loading";
import Main from "@/components/ui/main";
import { useServices } from "@/lib/api";
import { useAuth } from "@/store/authStore";
import useServicesStore from "@/store/servicesStore";
import { useEffect } from "react";

const Profile: React.FC = () => {
  const { services, setServices } = useServicesStore();
  const { user } = useAuth();
  const { data: servicesResponse, isLoading } = useServices();

  useEffect(() => {
    if (servicesResponse) {
      setServices(servicesResponse.record);
    }
  }, [servicesResponse, setServices]);

  if (isLoading || !user) return <Loading />;

  return (
    <Main>
      <div className="space-y-12">
        {/* Profile Section */}
        <UserProfile user={user} />

        {/* Popular Services Section */}
        <div className="mt-12 border-t pt-12">
          <PopularServicesSection services={services} />
        </div>
      </div>
    </Main>
  );
};

export default Profile;
