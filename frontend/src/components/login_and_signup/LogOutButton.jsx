import '../../assets/css/default.css';

export default function LogOutButton() {
  const handleSignOut = () => {
    // Removes the token from localStorage
    localStorage.removeItem("token");
    
    // Redirect to the login page
    window.location.href = "/login";
  };

  return (
    <button className="logOutButton" onClick={handleSignOut}>Log Out</button>
  );
}