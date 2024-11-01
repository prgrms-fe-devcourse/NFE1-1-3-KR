import { useState } from 'react';

import { supabase } from 'lib/supabase';

const LoginModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center'>
      <div className='max-w-md w-full bg-white rounded-lg p-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>로그인</h2>
        </div>

        {/* Error Alert */}
        {error && (
          <div className='mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center'>
            <svg
              className='w-5 h-5 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Google Login Button */}
        <button
          className='w-full bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-blue-100 font-medium rounded-lg text-sm px-5 py-4 text-center inline-flex items-center justify-center relative transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed'
          disabled={isLoading}
          onClick={handleLogin}
        >
          <span className='absolute left-4'>
            <svg className='w-5 h-5' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                fill='#4285F4'
              />
              <path
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                fill='#34A853'
              />
              <path
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                fill='#FBBC05'
              />
              <path
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                fill='#EA4335'
              />
            </svg>
          </span>
          <span className='ml-8'>{isLoading ? '로그인 중...' : 'Google 계정으로 계속하기'}</span>
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
