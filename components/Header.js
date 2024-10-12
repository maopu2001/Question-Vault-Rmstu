'use client';
import './navbar.css';
import Link from 'next/link';
import { useState } from 'react';

const MenuIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#ffffff">
    <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
  </svg>
);

const CloseIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#ffffff">
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </svg>
);

const HomeIcon = (
  <svg width="36px" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#ffffff">
    <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
  </svg>
);

const CreateIcon = (
  <svg width="36px" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#ffffff">
    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
  </svg>
);

const LoginIcon = (
  <svg width="36px" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#ffffff">
    <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
  </svg>
);

const SignupIcon = (
  <svg width="36px" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#ffffff">
    <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
  </svg>
);

export default function Header() {
  const [sideBarRendered, setSideBarRendered] = useState(false);

  const toggleSideBar = () => {
    setSideBarRendered(true);
    const sidebar = document.querySelector('sidebar');
    if (sidebar) sidebar.classList.toggle('open');
  };

  return (
    <header className="fixed h-20 w-full flex items-center justify-center bg-primary-800 text-white p-4 top-0 z-10">
      <h1 className="select-none text-2xl font-bold">Exam Question Dump</h1>
      <navbar className="lg:grid w-[300px] absolute right-10 hidden grid-cols-4 justify-items-center items-center font-semibold text-lg">
        <Link href="/">Home</Link>
        <Link href="/create">Create</Link>
        <Link href="/login">Login</Link>
        <Link href="/signup">Signup</Link>
      </navbar>
      <button
        id="menu-icon"
        onClick={toggleSideBar}
        className="rounded-xl lg:hidden block absolute right-5 w-12 h-12 p-2"
      >
        {MenuIcon}
      </button>
      {sideBarRendered && (
        <sidebar className="fixed z-50 pt-10 lg:hidden sm:w-[300px] w-screen bg-primary-800 h-screen px-10 flex flex-col items-center gap-4 font-semibold text-lg open">
          <button id="close-icon" onClick={toggleSideBar} className="w-12 h-12 my-4 rounded-full p-2">
            {CloseIcon}
          </button>
          <ul className="flex flex-col items-start gap-4 list-none *:w-40">
            <Link onClick={toggleSideBar} className="flex items-center gap-2" href="/">
              {HomeIcon} Home
            </Link>
            <Link onClick={toggleSideBar} className="flex items-center gap-2" href="/create">
              {CreateIcon} Create
            </Link>
            <Link onClick={toggleSideBar} className="flex items-center gap-2" href="/login">
              {LoginIcon} Login
            </Link>
            <Link onClick={toggleSideBar} className="flex items-center gap-2" href="/signup">
              {SignupIcon} Signup
            </Link>
          </ul>
        </sidebar>
      )}
    </header>
  );
}
