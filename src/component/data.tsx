import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Attendance } from '../types/attendance';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'UserID', headerName: 'UserID', width: 70 },
    { field: 'Name', headerName: 'Name', width: 130 },
    { field: 'Start', headerName: '出勤時間', width: 200 },
    { field: 'End', headerName: '退勤時間', width: 200 },
];

type Props = {
    attendance: Attendance[];
}

export const DataTable = ({ attendance }: Props) => {
    const row = attendance.map(a => ({
        id: a.id,
        UserID: a.userId,
        Name: a.name,
        Start: a.start,
        End: a.end
    }));
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <DataGrid
                rows={row}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
            />
        </div>
    );
}