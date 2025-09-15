import LoginRegister from "../components/login/LoginRegister";

type Props = {};

const Register = (props: Props) => {
  return (
    <div className="bg-background min-h-screen">
      <LoginRegister type="register" />
    </div>
  );
};

export default Register;
