const Loading = () => {
  return (
    <div className="animate-pulse w-full h-screen p-6">
      <div className="bg-zinc-800 h-[40vh] w-full mt-12 rounded-2xl flex justify-center items-center border border-zinc-700">
        <div className="w-[70%] h-16 bg-zinc-700 rounded-lg flex justify-center items-center border border-zinc-600">
          <p className="text-2xl text-zinc-400">Cargando...</p>
        </div>
      </div>
      <div className="bg-zinc-800 h-[20vh] w-full mt-4 rounded-xl p-4 border border-zinc-700">
        <div className="w-[70%] h-4 bg-zinc-700 rounded-md"></div>
        <div className="flex justify-around p-4 ">
          <div className="w-[30%] h-[12vh] bg-zinc-700 rounded-md border border-zinc-600"></div>
          <div className="w-[30%] h-[12vh] bg-zinc-700 rounded-md border border-zinc-600"></div>
          <div className="w-[30%] h-[12vh] bg-zinc-700 rounded-md border border-zinc-600"></div>
        </div>
      </div>
      <div className="bg-zinc-800 h-[25vh] w-full mt-4 rounded-xl p-4 border border-zinc-700">
        <div className="w-[70%] h-4 bg-zinc-700 rounded-md"></div>
        <div className="flex justify-around p-4">
          <div className="w-[30%] h-[15vh] bg-zinc-700 rounded-md border border-zinc-600"></div>
          <div className="w-[30%] h-[15vh] bg-zinc-700 rounded-md border border-zinc-600"></div>
          <div className="w-[30%] h-[15vh] bg-zinc-700 rounded-md border border-zinc-600"></div>
        </div>
      </div>

    </div>
  )
}
export default Loading