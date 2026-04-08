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
import { Check, X as XIcon, Clock } from 'lucide-react';
import './AppointmentsTable.css';

const updateAppointmentStatus = async ({ id, status }) => {
  const { data } = await axios.patch(`/api/appointments/${id}/status`, { status });
  return data;
};

import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function AppointmentsTable({ data }) {
  const queryClient = useQueryClient();
  const { user } = useAuth(); // dynamically capture current doctor context

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
      cell: info => <span className="fw-600">{info.getValue()}</span>
    },
    {
      header: 'Requested Time',
      accessorKey: 'startTime',
      cell: info => {
        const date = new Date(info.getValue());
        return (
          <div className="time-cell">
            <span className="date-main">{format(date, 'MMM d, yyyy')}</span>
            <span className="time-sub">{format(date, 'h:mm a')}</span>
          </div>
        );
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: info => {
        const status = info.getValue() || 'pending';
        return (
          <span className={`status-badge status-${status}`}>
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
            return <span className="action-resolved">Resolved</span>;
        }

        return (
          <div className="actions-cell">
            <button 
              className="action-btn approve"
              onClick={() => mutation.mutate({ id: appointment._id, status: 'approved' })}
              title="Approve"
            >
              <Check size={16} /> Approve
            </button>
            <button 
              className="action-btn reject"
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
    <div className="table-container">
      <table className="appointments-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {table.getRowModel().rows.length === 0 && (
             <tr>
                 <td colSpan={4} className="empty-state">No appointments found.</td>
             </tr>
          )}
        </tbody>
      </table>
      
      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="pagination">
            <button 
                onClick={() => table.previousPage()} 
                disabled={!table.getCanPreviousPage()}
                className="page-btn"
            >
            Prev
            </button>
            <span className="page-info">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button 
                onClick={() => table.nextPage()} 
                disabled={!table.getCanNextPage()}
                className="page-btn"
            >
            Next
            </button>
        </div>
      )}
    </div>
  );
}
