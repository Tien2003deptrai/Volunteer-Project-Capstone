import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

const AppliedDutyTable = () => {
  const { allAppliedDuties } = useSelector((store) => store.duty)

  if (allAppliedDuties.length <= 0) {
    return (
      <p className="text-center py-4 text-sm text-gray-500">
        You haven't applied to any duty yet.
      </p>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableCaption>
            A list of your applied duties as a volunteer
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Duty Role</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allAppliedDuties.map((appliedDuty) => (
              <TableRow key={appliedDuty._id}>
                <TableCell>
                  {appliedDuty?.createdAt?.split('T')[0]}
                </TableCell>
                <TableCell>{appliedDuty.duty?.tittle || appliedDuty.duty?.title}</TableCell>
                <TableCell>
                  {appliedDuty.duty?.organization?.name}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={`${appliedDuty?.status === 'rejected'
                      ? 'bg-red-400 hover:bg-[#6c1818]'
                      : appliedDuty.status === 'pending'
                        ? 'bg-gray-400'
                        : 'bg-green-400 hover:bg-[#165c3c]'
                      }`}
                  >
                    {appliedDuty.status.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {allAppliedDuties.map((appliedDuty) => (
          <div
            key={appliedDuty._id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <p className="text-sm text-gray-500">
              {appliedDuty?.createdAt?.split('T')[0]}
            </p>
            <h3 className="font-semibold text-lg">
              {appliedDuty.duty?.tittle || appliedDuty.duty?.title}
            </h3>
            <p className="text-sm text-gray-700">
              {appliedDuty.duty?.organization?.name}
            </p>
            <div className="mt-2">
              <Badge
                className={`${appliedDuty?.status === 'rejected'
                  ? 'bg-red-400 hover:bg-[#6c1818]'
                  : appliedDuty.status === 'pending'
                    ? 'bg-gray-400'
                    : 'bg-green-400 hover:bg-[#165c3c]'
                  }`}
              >
                {appliedDuty.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AppliedDutyTable
