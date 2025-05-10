
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export function NavLinks() {
  const location = useLocation();
  
  const links = [
    { href: "/feed", label: "Feed" },
    { href: "/discover", label: "Discover" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/wishlist", label: "Wishlist" }
  ];

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    // Log navigation attempt
    console.log(`NavLinks: Navigating to ${href}`);
    
    // If already on the current page, prevent default and do nothing
    if (location.pathname === href) {
      e.preventDefault();
      return;
    }
  };

  return (
    <nav className="flex items-center space-x-4">
      {links.map(link => (
        <Link
          key={link.href}
          to={link.href}
          onClick={(e) => handleNavClick(e, link.href)}
          className={`text-sm font-medium transition-colors hover:text-softspot-800 ${
            location.pathname === link.href
              ? "text-softspot-700 font-semibold"
              : "text-softspot-600"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
