import React from 'react';
import Link from 'next/link';

interface UserLinkButtonProps {
  user: {
    id: number;
    uuid: string;
    email: string;
    referralBonus: number;
    referralCount: number;
  };
}

const UserLinkButton: React.FC<UserLinkButtonProps> = ({ user }) => {
  return (
    <Link href={`/dashboard/users/${user.uuid}/edit`}>
      <span className='cursor-pointer text-xs text-inherit hover:underline'>
        {user.email}
      </span>
    </Link>
  );
};

export default UserLinkButton;
