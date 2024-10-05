import AuthForm from './AuthForm';

export default function SignupForm() {
    return (
        <AuthForm endpoint="http://localhost:4000/user/signup" title="Sign Up To FinTrack!" buttonText="Sign Up!" redirectTitleText="Already have an account?" redirectLink="/login" redirectText="Log in here!" />
    );
}