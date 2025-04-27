

interface PropType {
    mainText: string,
    inrAmount: number,
    usdAmount: number

}
const HeaderInfoCardInvoices = ({ mainText, inrAmount, usdAmount }: PropType) => {
    return (
        <div className="   flex flex-col justify-center ">
            <p className="text-gray-400">{mainText}</p>
            <p className="font-semibold text-[20px]">{`INR: ₹${inrAmount}`}</p>
            <p className="font-semibold text-[20px]">{`USD: $${usdAmount}`}</p>
        </div>
    )
}

export default HeaderInfoCardInvoices;