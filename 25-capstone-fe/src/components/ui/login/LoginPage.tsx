import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/seats");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="mb-10 text-center">
        <div className="text-4xl font-extrabold text-blue-600 tracking-wide">
          <span className="inline-block rotate-[-10deg]">의자</span>
          <span className="inline-block rotate-[10deg]">있네?</span>
        </div>
        <div className="text-sm text-gray-500 mt-1">스마트 좌석 점유 시스템</div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72 bg-white p-6 shadow-md rounded-lg">
        <input type="text" placeholder="아이디" className="border p-2 rounded" />
        <input type="password" placeholder="비밀번호" className="border p-2 rounded" />
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded font-semibold">
          로그인
        </button>
      </form>

      <div className="flex justify-between gap-4 mt-4 text-sm text-blue-600">
        <button onClick={() => navigate("/register")} className="hover:underline">회원가입</button>
        <button onClick={() => navigate("/find-account")} className="hover:underline">아이디/비밀번호 찾기</button>
      </div>
    </div>
  );
};

export default LoginPage;

