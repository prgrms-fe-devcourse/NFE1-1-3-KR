import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { getUserInfo } from 'api/auth';
import { Layout } from 'components';
import ModalRenderer from 'components/common/Modal/ModalRenderer';
import { ModalProvider, BackgroundColorProvider } from 'context';
import { supabase } from 'lib/supabase';
import { CommunityPage, MyPage, BookModal, HomePage } from 'pages';
import { useAuthStore } from 'stores';

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <></>,

    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/book/:id',
        element: <></>,
      },
      { path: '/community', element: <CommunityPage /> },
      { path: '/profile', element: <MyPage /> },
      { path: '/modal', element: <BookModal /> },
    ],
  },
]);

const queryClient = new QueryClient();

function App() {
  const { reset, setSession, setIsLoading, setUserInfo } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session) {
          setSession(session);

          const userInfo = await getUserInfo(session.user.id);
          setUserInfo(userInfo);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        reset();
      } finally {
        setIsLoading(false);
      }
    };

    void initializeAuth();

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        reset();
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(session);

        if (session) {
          try {
            const userInfo = await getUserInfo(session.user.id);
            setUserInfo(userInfo);
          } catch (error) {
            console.error('Error fetching user info:', error);
          }
        }
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BackgroundColorProvider>
        <ModalProvider>
          <RouterProvider router={router} />
          <ModalRenderer />
        </ModalProvider>
      </BackgroundColorProvider>
    </QueryClientProvider>
  );
}

export default App;
