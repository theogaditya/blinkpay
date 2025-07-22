import React from 'react';
import SignIn from '../components/auth/sign-in';
import SignOut from '../components/auth/signout-button';
import UserAvatar from '../components/auth/UserAvatar';


export default function Authing() {
  return (
    <div>
        <UserAvatar />
        <SignIn />
        <SignOut />
        
    </div>
  )
}