import React, {
  AnchorHTMLAttributes,
  MouseEvent,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type NavigateOptions = {
  replace?: boolean;
};

type RouterState = {
  pathname: string;
  navigate: (to: string, options?: NavigateOptions) => void;
};

const RouterContext = createContext<RouterState | null>(null);

function normalizePath(path: string) {
  if (!path) return "/";
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

const getPathname = () => {
  if (typeof window === "undefined") return "/";
  const path = window.location.pathname || "/";
  return normalizePath(path);
};

export function BrowserRouter({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState<string>(() => getPathname());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePopState = () => {
      setPathname(getPathname());
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigate = useCallback(
    (to: string, options?: NavigateOptions) => {
      if (typeof window === "undefined") return;
      const target = normalizePath(to.startsWith("/") ? to : `/${to}`);
      if (options?.replace) window.history.replaceState({}, "", target);
      else window.history.pushState({}, "", target);
      setPathname(target);
    },
    [],
  );

  const value = useMemo<RouterState>(
    () => ({ pathname, navigate }),
    [pathname, navigate],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

function useRouter() {
  const context = useContext(RouterContext);
  if (!context) throw new Error("useRouter must be used within a BrowserRouter");
  return context;
}

type RouteProps = {
  path?: string;
  index?: boolean;
  element?: React.ReactNode;
};

export function Routes({ children }: { children: React.ReactNode }) {
  const { pathname } = useRouter();
  const normalizedPath = normalizePath(pathname);
  let matched: React.ReactNode = null;
  let fallback: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (matched || !React.isValidElement<RouteProps>(child)) return;
    const { path, index, element } = child.props as RouteProps;
    if (index && normalizedPath === "/") {
      matched = element ?? null;
      return;
    }
    if (typeof path === "string") {
      const targetPath = normalizePath(path);
      if (targetPath === normalizedPath) {
        matched = element ?? null;
        return;
      }
      if (path === "*") {
        fallback = element ?? null;
      }
    }
  });

  return <>{matched ?? fallback}</>;
}

export function Route(_props: RouteProps) {
  return null;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  replace?: boolean;
};

export function Link({ to, replace, onClick, ...rest }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }
    event.preventDefault();
    navigate(to, { replace });
  };

  return <a href={to} onClick={handleClick} {...rest} />;
}

export function useNavigate() {
  const { navigate } = useRouter();
  return navigate;
}

export function useLocation() {
  const { pathname } = useRouter();
  return { pathname };
}

export default {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
};
