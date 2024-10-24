import Chat from "@/components/Chat";
import Header from "@/components/Header/Header";
import { Hero } from "@/components/Hero";
import Sidebar from "@/components/sidebar";
import SidebarToggle from "@/components/sidebarToggle";
import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div>
      <Header />
      {session ? (
        <div className="flex flex-col md:flex-row">
          <SidebarToggle userId={session.user.id}/>
          {/* Sidebar will be hidden on small screens and takes 30% on larger screens */}
          <div className="hidden md:block md:w-[30%]">
            <Sidebar userId={session.user.id} />
          </div>
          {/* Chat component takes 70% on larger screens, full width on small screens */}
          <div className="w-full md:w-[70%]">
            <Chat userId={session.user.id} />
          </div>
        </div>
      ) : (
        <Hero />
      )}
    </div>
  );
}