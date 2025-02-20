"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SlabBreakdown } from "@/lib/types"
import { SlabBreakdownTable } from "./slab-breakdown-table"
import { calculateTaxFY2025_26 } from "@/lib/utils"

export default function TaxCalculator() {
  const [salaries, setSalaries] = useState<number[]>([0])
  const [results, setResults] = useState<
    {
      salary: number
      tax: number
      effectiveRate: number
      effectiveSalary: number
      slabBreakdown: SlabBreakdown[]
      standardDeduction: number
      cess: number
    }[]
  >([])

  const handleSalaryChange = (index: number, value: string) => {
    const newSalaries = [...salaries]
    newSalaries[index] = Number(value)
    setSalaries(newSalaries)
  }

  const addSalary = () => {
    setSalaries([...salaries, 0])
  }

  const calculateTaxes = () => {
    const newResults = salaries.map((salary) => {
      const {
        tax,
        effectiveRate,
        effectiveSalary,
        slabBreakdown,
        standardDeduction,
        cess,
      } = calculateTaxFY2025_26(salary)
      return {
        salary,
        tax,
        effectiveRate,
        effectiveSalary,
        slabBreakdown,
        standardDeduction,
        cess,
      }
    })
    setResults(newResults)
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tax Calculator (FY 2025-2026)</h1>
      <div className="space-y-4">
        {salaries.map((salary, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              type="number"
              value={salary}
              onChange={(e) => handleSalaryChange(index, e.target.value)}
              placeholder="Enter annual salary"
              className="w-full"
            />
          </div>
        ))}
        <div className="flex space-x-2">
          <Button onClick={addSalary}>Add Another Salary</Button>
          <Button onClick={calculateTaxes}>Calculate Tax</Button>
        </div>
      </div>
      {results.length > 0 && (
        <div className="mt-8 space-y-8">
          {results.map((result, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-primary text-primary-foreground">
                <CardTitle>Salary: ₹{result.salary.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="flex justify-between">
                        <span>Taxable Income:</span>
                        <span className="font-semibold">
                          ₹
                          {(
                            result.salary - result.standardDeduction
                          ).toLocaleString()}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Standard Deduction:</span>
                        <span className="font-semibold">
                          ₹{result.standardDeduction.toLocaleString()}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Tax:</span>
                        <span className="font-semibold">
                          ₹{result.tax.toLocaleString()}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>CESS (4%):</span>
                        <span className="font-semibold">
                          ₹{result.cess.toLocaleString()}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Total Tax:</span>
                        <span className="font-semibold">
                          ₹{(result.cess + result.tax).toLocaleString()}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Effective Tax Rate:</span>
                        <span className="font-semibold">
                          {result.effectiveRate.toFixed(2)}%
                        </span>
                      </p>
                      <p className="flex justify-between text-lg font-bold text-green-600">
                        <span>Effective Salary:</span>
                        <span>₹{result.effectiveSalary.toLocaleString()}</span>
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Tax Breakdown</h3>
                      <SlabBreakdownTable breakdown={result.slabBreakdown} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
