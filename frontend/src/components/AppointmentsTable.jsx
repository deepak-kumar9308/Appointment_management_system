import React, { useMemo } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender, 
  getPaginationRowModel 
} from '@tanstack/react-table';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { Check, X as XIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const updateAppointmentStatus = async ({ id, status }) => {
  const { data } = await axios.patch(`/api/appointments/${id}/status`, { status });
  return data;
};

export default function AppointmentsTable({ data }) {
  const queryClient = useQueryClient();
  const { user } = useAuth(); 

  const mutation = useMutation({
    mutationFn: updateAppointmentStatus,
    onMutate: async (newStatusUpdate) => {
      await queryClient.cancelQueries({ queryKey: ['appointments', user.id] });
      const previousAppointments = queryClient.getQueryData(['appointments', user.id]);
      queryClient.setQueryData(['appointments', user.id], (old) => {
        if (!old) return old;
        return old.map(app => 
          app._id === newStatusUpdate.id 
            ? { ...app, status: newStatusUpdate.status } 
            : app
        );
      });
      return { previousAppointments };
    },
    onError: (err, newStatusUpdate, context) => {
      queryClient.setQueryData(['appointments', user.id], context.previousAppointments);
      toast.error('Failed to update status.');
    },
    onSuccess: (data, variables) => {
      if(variables.status === 'approved') toast.success('Appointment Approved');
      if(variables.status === 'rejected') toast.error('Appointment Rejected');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', user.id] });
    },
  });

  const columns = useMemo(() => [
    {
      header: 'Patient Name',
      accessorFn: row => row.patient?.name || 'Unknown Patient',
      cell: info => <span className="font-semibold text-slate-800">{info.getValue()}</span>
    },
    {
      header: 'Requested Time',
      accessorKey: 'startTime',
      cell: info => {
        const date = new Date(info.getValue());
        return (
          <div className="flex flex-col">
            <span className="font-medium text-slate-700">{format(date, 'MMM d, yyyy')}</span>
            <span className="text-sm text-slate-500">{format(date, 'h:mm a')}</span>
          </div>
        );
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: info => {
        const status = info.getValue() || 'pending';
        
        let pillColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        if (status === 'approved') pillColor = 'bg-green-100 text-green-800 border-green-200';
        if (status === 'rejected') pillColor = 'bg-red-100 text-red-800 border-red-200';

        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${pillColor}`}>
            {status === 'pending' && <Clock size={12} />}
            {status.toUpperCase()}
          </span>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const appointment = row.original;
        
        if (appointment.status !== 'pending') {
            return <div className="text-slate-400 font-medium text-sm">Resolved</div>;
        }

        return (
          <div className="flex items-center gap-2">
            <button 
              className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 rounded-lg text-sm font-medium transition-colors"
              onClick={() => mutation.mutate({ id: appointment._id, status: 'approved' })}
              title="Approve"
            >
              <Check size={16} /> Approve
            </button>
            <button 
              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-medium transition-colors"
              onClick={() => mutation.mutate({ id: appointment._id, status: 'rejected' })}
              title="Reject"
            >
              <XIcon size={16} /> Reject
            </button>
          </div>
        );
      }
    }
  ], [mutation]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
        pagination: {
            pageSize: 5
        }
    }
  });

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-slate-50 border-b border-slate-100">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
               <tr>
                   <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                     No appointments found.
                   </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <span className="text-sm text-slate-500">
              Page <span className="font-medium text-slate-700">{table.getState().pagination.pageIndex + 1}</span> of <span className="font-medium text-slate-700">{table.getPageCount()}</span>
            </span>
            <div className="flex gap-2">
              <button 
                  onClick={() => table.previousPage()} 
                  disabled={!table.getCanPreviousPage()}
                  className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                  onClick={() => table.nextPage()} 
                  disabled={!table.getCanNextPage()}
                  className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
        </div>
      )}
    </div>
  );
}
