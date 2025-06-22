interface PropType {
  mainText: string;
  count: string;
}
const HeaderInfoCard = ({ mainText, count }: PropType) => {
  return (
    <div className="   flex flex-col justify-center ">
      <p className="text-black  ">{mainText}</p>
      <p className="font-medium text-[30px] mt-3 flex items-end">{count}</p>
    </div>
  );
};

export default HeaderInfoCard;
