import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Edit2, Building2 } from "lucide-react";

/* eslint-disable react/prop-types */
const OrganizationsTable = ({ organizations, onEdit }) => {
  return (
    <Table>
      <TableCaption>Danh sách tất cả tổ chức</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Logo</TableHead>
          <TableHead>Tên tổ chức</TableHead>
          <TableHead>Địa chỉ</TableHead>
          <TableHead>Website</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations.length > 0 ? (
          organizations.map((organization) => (
            <TableRow key={organization._id} className="hover:bg-gray-50">
              <TableCell>
                <Avatar className="w-12 h-12">
                  {organization.logo ? (
                    <AvatarImage src={organization.logo} alt={organization.name} />
                  ) : (
                    <div className="w-full h-full bg-[#467057] flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                  )}
                </Avatar>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-semibold text-gray-900">{organization.name}</p>
                  {organization.description && (
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {organization.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm text-gray-700">{organization.location || 'N/A'}</p>
              </TableCell>
              <TableCell>
                {organization.website ? (
                  <a
                    href={organization.website.startsWith('http') ? organization.website : `https://${organization.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#467057] hover:underline truncate block max-w-xs"
                  >
                    {organization.website}
                  </a>
                ) : (
                  <p className="text-sm text-gray-400">N/A</p>
                )}
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {new Date(organization.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit && onEdit(organization)}
                  className="hover:bg-gray-100"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-12 text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <Building2 className="h-12 w-12 text-gray-300" />
                <p className="text-lg font-medium">Không tìm thấy tổ chức</p>
                <p className="text-sm">Tạo tổ chức đầu tiên để bắt đầu</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default OrganizationsTable;
