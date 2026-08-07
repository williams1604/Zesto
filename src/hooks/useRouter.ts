import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'login' }
  | { name: 'shop' }
  | { name: 'orders' }
  | { name: 'admin' };

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash === 'login') return { name: 'login' };
  if (hash === 'shop') return { name: 'shop' };
  if (hash === 'orders') return { name: 'orders' };
  if (hash === 'admin') return { name: 'admin' };
  return { name: 'home' };
}

export function navigate(route: Route['name']) {
  window.location.hash = `/${route === 'home' ? '' : route}`;
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(parseHash());

  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}
