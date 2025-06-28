import { ExpensesToBeReturnedType } from "@/app/api/expenses/route";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecentExpensesTableProps {
  expenses: ExpensesToBeReturnedType[];
}

export default function RecentExpensesTable({
  expenses,
}: RecentExpensesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3 opacity-50">Category</TableHead>
          <TableHead className="w-1/3 opacity-50">Amount</TableHead>
          <TableHead className="w-1/3 opacity-50">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((exp) => {
          return (
            <TableRow key={exp._id} className="h-[50px] dark:text-[#c5c8cc]">
              <TableCell className="flex items-center space-x-2 ">
                <span
                  className=" inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: exp.categoryColor }}
                />

                <div className="text-sm">{exp.category}</div>
              </TableCell>
              <TableCell className="font-medium">{exp.amount}</TableCell>

              <TableCell>{exp.date}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
