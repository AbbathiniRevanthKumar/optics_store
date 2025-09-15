import LoginRegister from "../components/login/LoginRegister"

type Props = {}

const Login = (props: Props) => {
  return (
    <div className="bg-background min-h-screen">
      <LoginRegister type="login"/>
    </div>
  )
}

export default Login