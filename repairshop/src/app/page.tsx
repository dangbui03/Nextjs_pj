// import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black bg-home-img bg-cover bg-center">
      <main className="flex flex-col justify-center text-center max-w-5xl 
      mx-auto h-dvh ">
        <div className="flex flex-col gap-6 p-12 rounded-xl
        bg-black/90 w-4/5 sm:max-w-96 mx-auto text-white sm:text-2xl"> 
          <h1 className="text-4xl font-bold">Dang&apos;s Computer <br/>Repair Shop</h1>
          <address>
            783 Tran Xuan Soan <br/>
            Tan Hung, District 7, Ho Chi Minh City, Vietnam
          </address>
          <p>
            Open Daily: 9am - 5pm
          </p>
          <Link href="tel: 0971741844" className="hover:underline"> 
            0971741844
          </Link>
        </div>
        
      </main>
    </div>
  );
}
