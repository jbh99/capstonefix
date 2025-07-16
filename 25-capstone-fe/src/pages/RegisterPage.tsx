import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="mb-10 text-center text-2xl font-bold text-blue-600">회원가입</div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72 bg-white p-6 shadow-md rounded-lg">
        <input type="text" placeholder="아이디" className="border p-2 rounded" />
        <input type="password" placeholder="비밀번호" className="border p-2 rounded" />
        <input type="password" placeholder="비밀번호 확인" className="border p-2 rounded" />
        <input type="email" placeholder="이메일" className="border p-2 rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded font-semibold hover:bg-blue-600">
          가입하기
        </button>
      </form>
      <button onClick={() => navigate("/login")} className="mt-4 text-blue-600 hover:underline text-sm">
        로그인 화면으로 돌아가기
      </button>
    </div>
  );
};

export default RegisterPage;
