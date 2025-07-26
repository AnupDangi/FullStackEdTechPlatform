import ProfileSection from '@/components/ProfileSection';

export default function DashboardPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 bg-white text-black">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">My Profile</h2>
      <ProfileSection />
    </div>
  );
}
