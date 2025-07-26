import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto py-12 bg-white text-black">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Login to Your Account</h2>
      <LoginForm />
    </div>
  );
}
