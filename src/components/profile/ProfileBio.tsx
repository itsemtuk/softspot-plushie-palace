
interface ProfileBioProps {
  bio?: string;
}

export const ProfileBio = ({ bio }: ProfileBioProps) => {
  return (
    <div className="mb-4">
      <h2 className="font-semibold text-gray-800 mb-2">About Me</h2>
      <p className="text-gray-700">{bio || "No bio yet"}</p>
    </div>
  );
};
