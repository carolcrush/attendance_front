import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { enqueueSnackbar } from 'notistack'
import { Attendance } from '../../types/attendance';

import { DataTable } from '../../component/data'

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function AdminHome() {
    const [attendance, setAttendance] = useState<Attendance[] | null>([]);
    const [id, setId] = useState<string>();
    const [name, setName] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_ATTENDANCE_URL + '/admin' ?? '')
            .then((response) => response.json())
            .then((data) => setAttendance(data));
    }, []);

    const onClickOk = () => {
        fetch(process.env.NEXT_PUBLIC_ATTENDANCE_URL + '/user' ?? '', {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id,
                name: name,
                password: password,
            }),
        }).then(async (res) => {
            console.log({ res })
            if (res.status != 200) {
                const msg = await res.json()
                throw new Error(msg)
            }
            enqueueSnackbar('success', { variant: 'success', anchorOrigin: { horizontal: 'center', vertical: 'top' } })
        }).catch((e: Error) => {
            console.log({ e })
            enqueueSnackbar(e.message, { variant: 'error', anchorOrigin: { horizontal: 'center', vertical: 'top' } })
        })
        setId('')
        setName('')
        setPassword('')
        handleClose()
    }

    return (
        <>
            <div style={{ marginTop: "30px", gap: 50, display: "flex" }}>
                <Button variant="contained" onClick={handleOpen} style={{ marginLeft: "30px", width: "200px", height: "50px" }}>ユーザ追加</Button>
            </div >
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" marginLeft={"80px"}>
                        id（必須）
                    </Typography>
                    <TextField
                        type="id"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setId(event.target.value);
                        }}
                        value={id}
                        style={{
                            marginLeft: "80px", marginBottom: "20px"
                        }}
                    />
                    < Typography id="modal-modal-title" variant="h6" component="h2" marginLeft={"80px"} >
                        name（必須）
                    </Typography>
                    <TextField
                        type="name"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setName(event.target.value);
                        }}
                        value={name}
                        style={{ marginLeft: "80px", marginBottom: "20px" }}
                    />
                    <Typography id="modal-modal-title" variant="h6" component="h2" marginLeft={"80px"}>
                        password（必須）
                        <div style={{ fontSize: "14px" }}>*アルファベットまたは数字8文字以上255文字以内</div>
                    </Typography>
                    <TextField
                        type="password"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setPassword(event.target.value);
                        }}
                        value={password}
                        style={{ marginLeft: "80px", marginBottom: "30px" }}
                    />
                    <div style={{ gap: 50, display: "flex" }}>
                        <Button sx={{ width: "150px" }} variant="contained" onClick={handleClose}>キャンセル</Button>
                        <Button sx={{ width: "150px" }} variant="contained" onClick={onClickOk}>OK</Button>
                    </div>
                </Box>
            </Modal >
            <DataTable attendance={attendance ?? []} />
        </>
    );
}