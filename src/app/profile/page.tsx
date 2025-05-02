"use client";
import { useAuth, useServices } from '@/apis/apiCalls'
import UserProfile from "@/components/account/user-profile-component";
import PopularServicesSection from "@/components/services/popular-services-section";
import Loading from "@/components/ui/loading";
import Main from "@/components/ui/main";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { services, isLoading } = useServices();

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
