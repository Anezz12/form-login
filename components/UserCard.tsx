'use client';
import { useUser } from '@/app/hooks/useUser';
import Image from 'next/image';
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
        <Image
          className="h-8 w-8 rounded-full"
          src="https://ui-avatars.com/api/?name=Guest&background=6b7280&color=fff"
          alt="Guest Profile"
          height={32}
          width={32}
        />
        <span className="ml-2 text-sm font-medium text-gray-700">
          Welcome, Guest!
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Image
        className="h-8 w-8 rounded-full"
        src={
          user.avatar ||
          'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'
        }
        alt={`${user.name} Profile`}
        height={32}
        width={32}
      />
      <span className="ml-2 text-sm font-medium text-gray-700">
        Welcome, {user.name}!, email: {user.email || 'N/A'}, Role: {user.role}
      </span>
    </div>
  );
}
