import { useLocation, useNavigate } from 'react-router-dom';

import { MenuButton } from './MenuButton';

import { LoginModal } from 'components';
import { supabase } from 'lib/supabase';
import { PopularPosts } from 'pages/community';
import { useIntroStore, useAuthStore, useModalStore } from 'stores';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isVisible = useIntroStore(state => state.isVisible);
  const openModal = useModalStore(state => state.openModal);
  const userInfo = useAuthStore(state => state.userInfo);

  const handleLogin = () => {
    openModal('LOGIN', { component: LoginModal });
  };

  const handleLogOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }
      navigate('/', { replace: true });
    } catch (error) {
      console.error('로그아웃 에러:', error);
      alert('로그아웃 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className='absolute flex items-center justify-center w-full h-[6rem] top-0 z-[9999]'>
      <h1
        className='absolute top-4 left-4 w-[3rem] h-[4rem] border-4 border-[#ef6767] flex items-center justify-center p-1'
        onClick={() => {
          navigate('/');
        }}
      >
        <img alt='logo' className='object-contain' src='/Logo.svg' />
      </h1>
      {location.pathname.startsWith('/community') && <PopularPosts />}

      {userInfo ? (
        <>
          <span>{userInfo.username}</span>
          <button className='p-3 bg-blue-300' onClick={handleLogOut}>
            로그아웃
          </button>
        </>
      ) : (
        <button className='p-3 bg-blue-300' onClick={handleLogin}>
          로그인
        </button>
      )}
      {!isVisible && <MenuButton />}
    </div>
  );
};
