import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SeatSelectPage } from "./pages/SeatSelectPage";

const queryClient = new QueryClient();

function App() {

  
  return (
    <div className='w-screen m-1 overflow-hidden'>
      <QueryClientProvider client={queryClient}>
        <main className='flex w-dvw snap-start'>
          <div className='w-fit m-auto p-10 pt-0 h-dvh'>
            <SeatSelectPage />
          </div>
        </main>
      </QueryClientProvider>
    </div>
  );
}

export default App;
