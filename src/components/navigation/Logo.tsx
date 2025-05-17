
import { Link } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth/authState";

export function Logo() {
  const isSignedIn = isAuthenticated();
  
  return (
    <Link to={isSignedIn ? "/feed" : "/waitlist"} className="flex items-center space-x-2">
      <span className="font-bold text-xl text-softspot-600">SoftSpot</span>
      <div className="h-6 w-6 rounded-full bg-softspot-200 flex items-center justify-center">
        <span className="text-sm">🧸</span>
      </div>
    </Link>
  );
}
