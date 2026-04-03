import Link from "next/link";

export default function SideStats() {
  return (
    <div className="space-y-6 flex-col items-center">
      
      {/* BALANCE */}
      <div className="flex justify-between">
        <div>
            <p className="text-sm text-gray-500">Solde FCFA</p>
            <h2 className="text-xl font-semibold">13 308 765</h2>
            <p className="text-xs text-gray-400">Disponible pour payer</p>
        </div>
        <div>
            <Link href="/soldes" className="text-blue-500 hover:underline">
              Afficher les détails
            </Link>
        </div>
      </div>
      

      <hr className="mt-25"/>

      {/* PAYOUTS */}
      <div className="flex justify-between">
            <div>
                <p className="text-sm text-gray-500">Virements</p>
                <h2 className="text-xl font-semibold">10 263 307</h2>
                <p className="text-xs text-gray-400">Attendu aujourd{"'"}hui</p>
            </div>
            <div>
                <Link href="/soldes" className="text-blue-500 hover:underline">
                Afficher les détails
                </Link>
            </div>
      </div>
      
    </div>  
  );
}