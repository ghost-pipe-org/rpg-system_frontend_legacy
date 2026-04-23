import { useState } from "react";
import { Button } from "../ui/button";
import { Menu, LogOut, User as UserIcon } from "lucide-react";
import { useLocation } from "react-router";
import logo from "../../assets/icons/logo.png";
import { useAuth } from "../../context/AuthContext";
import { useAppNavigation } from "../../hooks/useAuth";
import { ROUTES, ROUTE_LABELS } from "../../routes/routes";

const Separator: React.FC = () => <span className="mx-5">•</span>;

const navLinkClass =
  "hover:text-primary  font-semibold text-muted-foreground transition-colors duration-200 text-lg py-2 font-prompt";

const activeNavLinkClass =
  "text-primary font-semibold transition-colors duration-200 text-lg py-2 font-prompt";

export default function Navbar() {
  interface Page {
    endpoint: string;
    linkName: string;
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const { goToHome, goToLogin, goToRegister, goTo } = useAppNavigation();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isAuthPage =
    location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER;

  // Verifica se o usuário é admin
  const isAdmin = user?.role === 'ADMIN';

  const pages: Page[] = [
    {
      endpoint: ROUTES.HOME,
      linkName: ROUTE_LABELS[ROUTES.HOME],
    },
    {
      endpoint: ROUTES.SESSIONS,
      linkName: ROUTE_LABELS[ROUTES.SESSIONS],
    },
    {
      endpoint: ROUTES.CREATE_SESSIONS,
      linkName: ROUTE_LABELS[ROUTES.CREATE_SESSIONS],
    },
    {
      endpoint: ROUTES.CREATE_WORKSHOP,
      linkName: ROUTE_LABELS[ROUTES.CREATE_WORKSHOP],
    },
    {
      endpoint: ROUTES.PROFILE,
      linkName: ROUTE_LABELS[ROUTES.PROFILE],
    },
  ];

  // Adiciona a página Admin apenas se o usuário for admin
  if (isAdmin) {
    pages.push({
      endpoint: ROUTES.ADMIN,
      linkName: ROUTE_LABELS[ROUTES.ADMIN],
    });
  }

  const signOut = () => {
    logout();
    goToHome();
  };

  return (
    <nav
      className="flex justify-between items-center px-6 py-4 bg-background border-b-2 border-transparent bg-clip-border relative"
      style={{
        borderImage:
          "linear-gradient(to right, var(--secondary), var(--background), var(--primary)) 1",
      }}
    >
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer hover:bg-transparent"
          onClick={goToHome}
        >
          <img src={logo} alt="Logo" className="h-8 w-8" />
        </Button>
      </div>

      {!isAuthPage && (
        <div className="hidden lg:flex items-center text-foreground absolute left-1/2 transform -translate-x-1/2">
          {pages.map((page, index) => (
            <div
              key={`${page.linkName}-${index}`}
              className="flex items-center"
            >
              <Button
                variant="ghost"
                onClick={() => goTo(page.endpoint)}
                className={`${
                  isActive(page.endpoint) ? activeNavLinkClass : navLinkClass
                } font-mono lowercase hover:bg-transparent`}
              >
                {page.linkName}
              </Button>
              {index < pages.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      )}

      <span className="lg:flex flex-row gap-2 hidden">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-foreground">
              <UserIcon size={20} />
              <span className="text-sm font-medium">
                {user?.name || "Usuário"}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant="outline"
              className="hidden lg:flex items-center justify-center px-4 py-1"
              onClick={goToLogin}
            >
              entrar
            </Button>

            <Button
              className="hidden lg:flex items-center justify-center px-4 py-1"
              onClick={goToRegister}
            >
              criar conta
            </Button>
          </>
        )}
      </span>

      {!isAuthPage && (
        <button
          className="lg:hidden"
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu color="var(--foreground)" size={36} />
        </button>
      )}

      {!isAuthPage && menuOpen && (
        <div className="lg:hidden absolute top-15 right-0 mt-2 bg-background border border-primary border-t-background rounded-t-none shadow-lg flex flex-col items-center p-4 z-50 min-w-[160px]">
          {pages.map((page, index) => (
            <div key={`${page.linkName}-${index}`} className="flex my-2">
              <button
                onClick={() => {
                  goTo(page.endpoint);
                  setMenuOpen(false);
                }}
                className={
                  isActive(page.endpoint) ? activeNavLinkClass : navLinkClass
                }
              >
                {page.linkName}
              </button>
            </div>
          ))}

          {isAuthenticated ? (
            <div className="flex flex-col justify-center items-center gap-2 mt-2">
              <div className="flex items-center gap-2 text-foreground mb-2">
                <UserIcon size={20} />
                <span className="text-sm font-medium">
                  {user?.name || "Usuário"}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={signOut}
                className="flex w-full items-center gap-2 px-4 py-1"
              >
                <LogOut size={16} />
                Sair
              </Button>
            </div>
          ) : (
            <span className="flex flex-col justify-center items-center gap-2 mt-2">
              <Button
                variant="outline"
                className="flex w-full px-4 py-1"
                onClick={() => {
                  goToLogin();
                  setMenuOpen(false);
                }}
              >
                entrar
              </Button>

              <span className="text-foreground mb-2">ou</span>

              <Button
                className="px-4 py-1"
                onClick={() => {
                  goToRegister();
                  setMenuOpen(false);
                }}
              >
                criar conta
              </Button>
            </span>
          )}
        </div>
      )}
    </nav>
  );
}
