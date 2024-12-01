export const OrderLoader = () => {
    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b text-stone-800">
        <div className="w-[600px] max-w-[95%] h-[600px] flex flex-col gap-2">
          <div className="border-slate-200 border-2 px-2 py-1 rounded-md justify-between flex flex-row gap-2">
            <p className="text-sm font-bold">Order ID:</p>
            <button className="flex flex-row gap-2 items-center opacity-70 hover:opacity-100">
                <div className="gradient-loader rounded-md h-4 w-20"/>
            </button>
          </div>
          <div className="xl:p-5 lg:p-5 md:p-5 p-2 gap-2 flex flex-col mt-5 bg-blue-100 rounded-lg">
            <div className="bg-blue-300 px-2 py-1 rounded-md justify-between flex flex-row gap-2">
              <p className="text-sm font-bold">Deposit</p>
            </div>
            <button className="hover:opacity-90 opacity-70 flex flex-row justify-between h-16 gap-5 items-center xl:px-5 lg:px-5 md:px-5 px-3 bg-blue-200 rounded-lg ">
            <div className="gradient-loader rounded-md h-6 w-full"/>
            </button>
            <div className="flex flex-row h-10 py-1 xl:px-5 lg:px-5 md:px-5 px-3 items-center rounded-md justify-between bg-blue-200">
              <div className="flex flex-row h-8 gap-2 items-center w-full rounded-md py-1">
                <p className="opacity-60 text-sm font-bold">send</p>
                <div className="gradient-loader rounded-md h-4 w-full"/>
              </div>
            </div>
          </div>
          <div className="bg-slate-200 border-2 px-2 mt-5 py-1 rounded-md justify-between flex flex-row gap-2">
            <p className="text-sm font-bold">Receive</p>
          </div>
          <button disabled className="hover:opacity-90 opacity-70 flex flex-row justify-between h-12 gap-5 items-center xl:px-5 lg:px-5 md:px-5 px-3 bg-zinc-200 rounded-lg ">
            <div className="gradient-loader rounded-md h-4 w-full"/>
          </button>
          <div className="flex flex-row h-10 py-1 xl:px-5 lg:px-5 md:px-5 px-3 items-center rounded-md justify-between bg-zinc-200">
            <div className="flex flex-row h-8 gap-2 items-center w-full rounded-md py-1">
              <p className="opacity-60 text-sm font-bold">receive</p>
              <div className="gradient-loader rounded-md h-4 w-full"/>
            </div>
          </div>
          <div className="bg-slate-200 mt-5 border-2 px-2 py-1 rounded-md justify-between flex flex-row gap-2">
            <p className="text-sm font-bold">Progress</p>
          </div>
          <div className="flex flex-row w-full gap-2">
            <div className="flex-1">
              <div className="h-3 bg-slate-300 rounded-full"/>
              <p className="text-xs text-center">pending deposit</p>
            </div>
            <div className="flex-1">
              <div className="h-3 bg-slate-300 rounded-full"/>
              <p className="text-xs text-center">funds received</p>
            </div>
            <div className="flex-1">
              <div className="h-3 bg-slate-300 rounded-full"/>
              <p className="text-xs text-center">exchanging</p>
            </div>
            <div className="flex-1">
              <div className="h-3 bg-slate-300 rounded-full"/>
              <p className="text-xs text-center">processing</p>
            </div>
          </div>
        </div>
      </main>
    )
}