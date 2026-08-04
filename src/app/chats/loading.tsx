import { ChatSidebarSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <main className="flex-1">
            <div className="bg-[radial-gradient(900px_420px_at_8%_-10%,rgba(47,58,223,0.14),transparent_55%),radial-gradient(700px_380px_at_92%_0%,rgba(47,58,223,0.08),transparent_50%),linear-gradient(160deg,#EEF0FB,#F5F6FC_45%,#F8F9FD)] px-0 py-0 sm:px-4 sm:py-4 lg:px-6">
                <div className="mx-auto flex h-[calc(100dvh-6.75rem)] max-w-[1480px] gap-0 sm:gap-4 lg:h-[calc(100dvh-4.5rem)] lg:gap-5">
                    <div className="flex h-full w-full flex-col rounded-3xl bg-white sm:rounded-[28px] lg:w-[300px] lg:shrink-0 xl:w-[320px]">
                        <ChatSidebarSkeleton />
                    </div>
                    <div className="hidden h-full min-w-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-slate-200/90 bg-white lg:flex">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                            <Skeleton className="h-11 w-11 rounded-full" />
                            <div className="min-w-0 flex-1">
                                <Skeleton className="h-4 w-32 rounded" />
                                <Skeleton className="mt-2 h-3 w-20 rounded" />
                            </div>
                        </div>
                        <div className="flex flex-1 items-center justify-center">
                            <Skeleton className="h-24 w-24 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
