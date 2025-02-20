import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SlabBreakdown } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateTaxFY2025_26 = (
  salary: number
): {
  tax: number
  effectiveRate: number
  effectiveSalary: number
  slabBreakdown: SlabBreakdown[]
} => {
  let tax = 0
  let remainingSalary = salary
  const slabBreakdown: SlabBreakdown[] = []

  const slabs = [
    { limit: 400000, rate: 0 },
    { limit: 400000, rate: 0.05 },
    { limit: 400000, rate: 0.1 },
    { limit: 400000, rate: 0.15 },
    { limit: 400000, rate: 0.2 },
    { limit: 400000, rate: 0.25 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.3 },
  ]

  let slabStart = 0
  for (const slab of slabs) {
    const taxableAmount = Math.min(remainingSalary, slab.limit)
    const taxForSlab = taxableAmount * slab.rate
    tax += taxForSlab

    slabBreakdown.push({
      slabStart,
      slabEnd: slabStart + slab.limit,
      rate: slab.rate * 100,
      taxableAmount,
      taxForSlab,
    })

    remainingSalary -= taxableAmount
    slabStart += slab.limit

    if (remainingSalary <= 0) break
  }

  // Applying rebate for income up to 12 Lakhs
  if (salary <= 1200000) {
    tax = 0
    slabBreakdown.forEach((slab) => (slab.taxForSlab = 0))
  }

  const effectiveRate = (tax / salary) * 100
  const effectiveSalary = salary - tax

  return { tax, effectiveRate, effectiveSalary, slabBreakdown }
}
