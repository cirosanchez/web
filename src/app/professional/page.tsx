import Link from "next/link";

export default function ProfessionalPage() {
    return (
      <>
        <div className="flex justify-center text-ctp-subtext0">
          <div className="max-w-2xl w-full pt-10 pb-10">
            <h1 className="text-2xl font-bold text-ctp-text mb-8">
              Professional
            </h1>
            <h2 className={"text-xl font-bold text-ctp-text mb-8"}>
              Experience
            </h2>
            <b>Administrator</b>
            <p>
              <i>
                <Link href={"https://es.namemc.com/server/hazelmc.com"}>
                  HazelMC Network
                </Link>
              </i>
            </p>
              <p>
                
              </p>
          </div>
        </div>
      </>
    );
}