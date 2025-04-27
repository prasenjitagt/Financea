import Image from "next/image";
import ReceiptIcon from "@/assets/icons/receipt_icon.svg";

interface NoResultsForTablesProps {
    IconWidth: number,
    MainText: string,
    note?: "Get started by adding some",

}


export default function NoResultsForTables({ IconWidth, MainText, note = "Get started by adding some" }: NoResultsForTablesProps) {
    return (
        <div className="h-full p-8 flex flex-col items-center justify-center">
            <Image src={ReceiptIcon} alt="Receipt Icon" width={IconWidth} />
            <h2 className="text-[25px]">{MainText}</h2>
            <p className="text-[17px] text-muted-foreground">{note}</p>
        </div>
    );
}

