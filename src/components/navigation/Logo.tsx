
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <span className="text-2xl font-extrabold text-softspot-500 mr-2">SoftSpot</span>
      <div className="h-8 w-8 rounded-full bg-softspot-200 flex items-center justify-center animate-float">
        <span className="text-lg">🧸</span>
      </div>
    </Link>
  );
};
