import { useState, useEffect, useCallback } from 'react';

export interface RouteState {
  path: string;
  params: Record<string, string>;
  searchParams: URLSearchParams;
}

function parseLocation(): RouteState {
  const pathname = window.location.pathname || '/home';
  const searchParams = new URLSearchParams(window.location.search);

  // Match /details/:id
  const detailsMatch = pathname.match(/^\/details\/([^/?#]+)/);
  if (detailsMatch) {
    return {
      path: '/details/:id',
      params: { id: decodeURIComponent(detailsMatch[1]) },
      searchParams,
    };
  }

  // Match /watch/:id
  const watchMatch = pathname.match(/^\/watch\/([^/?#]+)/);
  if (watchMatch) {
    return {
      path: '/watch/:id',
      params: { id: decodeURIComponent(watchMatch[1]) },
      searchParams,
    };
  }

  // Known root aliases
  let cleanPath = pathname;
  if (cleanPath === '/' || cleanPath === '') {
    cleanPath = '/home';
  }

  return {
    path: cleanPath,
    params: {},
    searchParams,
  };
}

export function useRouter() {
  const [route, setRoute] = useState<RouteState>(parseLocation);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseLocation());
    };

    const handleCustomNav = () => {
      setRoute(parseLocation());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('app-navigation', handleCustomNav);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('app-navigation', handleCustomNav);
    };
  }, []);

  const navigate = useCallback((targetUrl: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      window.history.replaceState(null, '', targetUrl);
    } else {
      window.history.pushState(null, '', targetUrl);
    }
    window.dispatchEvent(new Event('app-navigation'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    ...route,
    navigate,
  };
}
