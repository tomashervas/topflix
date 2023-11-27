const Loading = () => {
  return (
    <div className="animate-pulse w-full h-screen p-6">
      <div className="bg-zinc-800 h-[40vh] w-full mt-12 rounded-2xl flex justify-center items-center border border-zinc-700">
        <div className="w-[70%] h-16 bg-zinc-700 rounded-lg flex justify-center items-center border border-zinc-600">
          <p className="text-2xl text-zinc-400">Cargando...</p>
        </div>
      </div>
      <div className="w-[30%] h-4 bg-red-500 mt-4"></div>
      <div className="w-[50%] h-6 bg-zinc-400 mt-2"></div>
      <div className="w-[40%] h-3 bg-zinc-600 mt-2"></div>
      <div className="bg-zinc-400 h-10 w-full mt-4 rounded-xl p-4"></div>
      <div className="w-[90%] h-3 bg-zinc-600 mt-4"></div>
      <div className="w-[80%] h-3 bg-zinc-600 mt-2"></div>
      <div className="w-[90%] h-3 bg-zinc-600 mt-2"></div>
      <div className="w-[70%] h-3 bg-zinc-600 mt-2"></div>
      <div className="w-[80%] h-3 bg-zinc-600 mt-4"></div>
      <div className="w-[40%] h-3 bg-zinc-600 mt-2"></div>
      <div className="w-[50%] h-3 bg-zinc-600 mt-2"></div>
      <div className="w-[70%] h-3 bg-zinc-600 mt-2"></div>
          

    </div>
  )
}
export default Loading