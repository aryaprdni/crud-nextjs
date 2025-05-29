import CreateUserForm from "./components/create-users-form";

export default function CreateUserPage() {
  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Create New User</h1>
      <CreateUserForm />
    </div>
  );
}
