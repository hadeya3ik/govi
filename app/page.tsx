import Image from "next/image";
import GetDeviceList from '@/app/components/GetDeviceList'

export default function Home() {
  return (
    <div className="">
      <GetDeviceList></GetDeviceList>
    </div>
  );
}
