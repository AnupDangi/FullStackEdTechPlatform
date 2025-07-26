import SignupForm from '@/components/SignupForm';

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto py-12 bg-white text-black">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Create Your Account</h2>
      <SignupForm />
    </div>
  );
}
