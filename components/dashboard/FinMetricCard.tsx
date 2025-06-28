import { IoIosArrowRoundUp } from "react-icons/io";
import { Archivo } from "next/font/google";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useEffect, useState } from "react";

const archivo = Archivo({
  subsets: ["latin"],
});

type Proptype = {
  title: string;
  amount: number;
  incDecPercentage: number;
  isIncreased: boolean;
  text: string;
};

const FinMetricCard = ({
  title,
  amount,
  incDecPercentage,
  isIncreased,
  text,
}: Proptype) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const selectedCurrency = useSelector(
    (state: RootState) => state.currencyInfo.currency
  );
  const currencySymbol = selectedCurrency === "INR" ? "₹" : "$";

  if (!hasMounted) return null; // Avoid SSR/CSR mismatch

  return (
    <div className={`${archivo.className} flex justify-between rounded-lg`}>
      <div className="flex flex-col dark:text-[#c5c8cc] justify-between items-start">
        <p className="text-base  font-normal">{title}</p>
        <p className="text-[26px] font-medium">{`${currencySymbol}${amount}`}</p>
      </div>

      <div className="flex flex-col justify-center items-end">
        <div
          className={`w-fit h-[30px] flex justify-center items-center gap-1 rounded-md px-2 
                        ${isIncreased ? "text-[#3aac51] " : "text-[#C11919] "}`}
        >
          <IoIosArrowRoundUp
            size={24}
            className={isIncreased ? "" : "rotate-180"}
          />
          <p className="text-[14px] font-[500]">${incDecPercentage}</p>
        </div>

        <p className="text-base dark:text-[#c5c8cc] font-normal text-right">{text}</p>
      </div>
    </div>
  );
};

export default FinMetricCard;
