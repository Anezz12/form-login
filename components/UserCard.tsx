'use client';
import { useUser } from '@/app/hooks/useUser';

export default function UserCard() {
  const { user, loading, error } = useUser();
  console.log('UserCard:', { user, loading, error });
  if (loading) {
    return (
      <div className="flex items-center space-x-3">
        <div className="animate-pulse">
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center">
        <img
          className="h-8 w-8 rounded-full"
          src="https://ui-avatars.com/api/?name=Guest&background=6b7280&color=fff"
          alt="Guest Profile"
        />
        <span className="ml-2 text-sm font-medium text-gray-700">
          Welcome, Guest!
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <img
        className="h-8 w-8 rounded-full"
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.name
        )}&background=6366f1&color=fff`}
        alt={`${user.name} Profile`}
      />
      <span className="ml-2 text-sm font-medium text-gray-700">
        Welcome, {user.name}!, email: {user.email || 'N/A'}
      </span>
    </div>
  );
}
