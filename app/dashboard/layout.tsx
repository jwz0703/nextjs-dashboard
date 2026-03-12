import SideNav from "../ui/dashboard/sidenav";
import { WaveBackground } from "../ui/test/WaveProgress";

export default function Layout({children}:{children:React.ReactNode}){
    return (
    <div className="flex h-dvh flex-col md:flex-row md:overflow-hidden">
        <WaveBackground progress={85}/>
        <div className="w-full flex-none md:w-64">
            <SideNav/>
        </div>
        <div className=" flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>);

}