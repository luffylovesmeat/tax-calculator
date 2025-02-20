import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SlabBreakdown } from "@/lib/types"

export const SlabBreakdownTable = ({
  breakdown,
}: {
  breakdown: SlabBreakdown[]
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Slab</TableHead>
        <TableHead>Rate</TableHead>
        <TableHead>Taxable Amount</TableHead>
        <TableHead>Tax</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {breakdown.map((slab, index) => (
        <TableRow key={index}>
          <TableCell>
            ₹{slab.slabStart.toLocaleString()} - ₹
            {slab.slabEnd.toLocaleString()}
          </TableCell>
          <TableCell>{slab.rate}%</TableCell>
          <TableCell>₹{slab.taxableAmount.toLocaleString()}</TableCell>
          <TableCell>₹{slab.taxForSlab.toLocaleString()}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)
