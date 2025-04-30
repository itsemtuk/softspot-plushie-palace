
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <span className="font-bold text-xl text-softspot-600">SoftSpot</span>
      <div className="h-6 w-6 rounded-full bg-softspot-200 flex items-center justify-center">
        <span className="text-sm">🧸</span>
      </div>
    </Link>
  );
}
