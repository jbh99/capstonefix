import { useNavigate } from "react-router-dom";

const FindAccountPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("해당 이메일로 임시 비밀번호를 보냈습니다.");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="mb-10 text-center text-2xl font-bold text-blue-600">아이디/비밀번호 찾기</div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72 bg-white p-6 shadow-md rounded-lg">
        <input type="email" placeholder="가입한 이메일 주소" className="border p-2 rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded font-semibold hover:bg-blue-600">
          전송하기
        </button>
      </form>
      <button onClick={() => navigate("/login")} className="mt-4 text-blue-600 hover:underline text-sm">
        로그인 화면으로 돌아가기
      </button>
    </div>
  );
};

export default FindAccountPage;
