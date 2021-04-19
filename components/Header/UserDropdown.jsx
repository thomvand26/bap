import { LANDING } from '@/routes';
import { signOut, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React from 'react';

export const UserDropdown = () => {
  const [session] = useSession();
  const router = useRouter();

  const handleOptionChange = (event) => {
    const { value } = event.target;

    switch (value) {
      case 'logout':
        signOut();
        router.push(LANDING);
        break;

      default:
        break;
    }
  };

  return (
    <select
      name="userDropdown"
      id="userDropdown"
      onChange={handleOptionChange}
      selected="default"
    >
      <option value="default">{session?.user?.username}</option>
      <option value="logout">logout</option>
    </select>
  );
};
