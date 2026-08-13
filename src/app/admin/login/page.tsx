import LoginForm from "@/components/admin/login-form";

export const metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex justify-center text-neutral-400">
      <div className="max-w-2xl w-full pt-10 pb-10">
        <h1 className="text-2xl font-bold text-neutral-300 mb-8">
          <span className="text-neutral-500">\</span>login
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
