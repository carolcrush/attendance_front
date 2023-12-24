import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Attendance } from '../types/attendance';
import { parseISO } from 'date-fns';

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'start', headerName: '出勤時間', width: 200, },
    { field: 'end', headerName: '退勤時間', width: 200 },
    {
        field: 'period', headerName: '勤務時間', width: 130, renderCell: (params) => {
            if (!params.row.end) {
                return "出勤中"
            }
            const Start = parseISO(params.row.start)
            const End = parseISO(params.row.end)
            const timeDifference = Math.abs(Start.getTime() - End.getTime());
            const hours = Math.floor(timeDifference / 3600000);
            const minutes = Math.floor((timeDifference % 3600000) / 60000);
            const seconds = Math.floor((timeDifference % 60000) / 1000);
            console.log(888)
            return <div>{`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</div>
        }
    },
];

type Props = {
    attendance: Attendance[];
}

export const DataTable = ({ attendance }: Props) => {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <DataGrid
                sx={{ paddingX: '30px' }}
                rows={attendance}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection={false}

            />
        </div>
    );
}