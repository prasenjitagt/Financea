"use client";

import Image from "next/image";
import CopyIcon from "@/assets/icons/copy_clients_table_icon.svg";
import { showToast } from "@/lib/helpers/clients_table/copied_to_clipboard_toast";

interface PropTypes {
    infoType: "email" | "phone";
    infoName: string;
    val: string;
}

export default function ProfileHoverCardDemo({ infoType, infoName, val }: PropTypes) {

    const toastText = infoType === "email" ? "Email ID Copied!" : "Phone Number Copied!";


    return (

        <div className="flex justify-start items-center cursor-default">
            <p>{infoName}</p>
            <section className="flex space-x-2">
                <p className="text-[17px] ml-1" title={val}>{val}</p>
                <Image
                    className="cursor-pointer"
                    src={CopyIcon}
                    alt="Copy-Icon"
                    width={16}
                    onClick={() => {
                        showToast(toastText);
                        navigator.clipboard.writeText(val);
                    }}
                />
            </section>
        </div>

    );
}
