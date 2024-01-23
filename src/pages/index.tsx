import { useEffect, useState } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import dynamic from "next/dynamic";
import { enqueueSnackbar } from 'notistack'
import TextField from '@mui/material/TextField';
import { Attendance } from '../types/attendance';

const Time = dynamic(() => import("../component/time").then((module) => module.Time), { ssr: false });


const dateFormat = (date: string) => {
  const a = date.split(' ')
  const b = a[0].split('-')
  return `${b[1]}/${b[2]} ${a[1]}`
}
const display = (attendance: Attendance) => {
  if (attendance.start) {

    return (
      <div>{dateFormat(attendance.start)} <span style={{ color: 'green' }}>出勤</span> {attendance.name}</div>
    )
  }
  if (attendance.end) {
    return (
      <div>{dateFormat(attendance.end)} <span style={{ color: 'red' }}>退勤</span> {attendance.name}</div>
    )
  }
}

type User = {
  id: string,
  name: string,
}

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

const selectKindStyle = {
  width: "500px",
  height: "50px",
  backgroundColor: "green",
  '&:hover': {
    backgroundColor: "green",
  }
}

const defaultStyle = {
  width: "300px",
  height: "50px",
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [users, setUsers] = useState<User[] | null>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [kind, setKind] = useState<'start' | 'end'>();
  const [password, setPassword] = useState<string>();
  const [attendance, setAttendance] = useState<Attendance[] | null>([]);

  const getAttendance = () => {
    fetch(process.env.NEXT_PUBLIC_ATTENDANCE_URL + '/admin' ?? '')
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const a = (data as Attendance[]).reduce((arr, cur) => {
            let b = []
            b = [...arr, {
              ...cur,
              end: ''
            }]
            if (cur.end) {
              b = [...b, {
                ...cur,
                start: ''
              }]
            }
            return b
          }, [] as Attendance[])
          setAttendance(a)
        }
      });
  }

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_ATTENDANCE_URL + '/user' ?? '')
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  const onClickUserName = (user: User) => {
    setSelectedUser(user)
    handleOpen();
  }

  useEffect(() => {
    getAttendance();
  }, []);

  const onClickOk = () => {
    const originalDate = new Date();
    const isoDateString = originalDate.toLocaleString();
    fetch(process.env.NEXT_PUBLIC_ATTENDANCE_URL + '/attendance' ?? '', {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: selectedUser?.id,
        kind: kind,
        time: isoDateString,
        password: password,
      }),
    }).then(async (res) => {
      console.log({ res })
      if (res.status != 200) {
        const msg = await res.json()
        throw new Error(msg)
      }
      getAttendance();
      enqueueSnackbar('success', { variant: 'success', anchorOrigin: { horizontal: 'center', vertical: 'top' } })
    }).catch((e: Error) => {
      console.log({ e })
      enqueueSnackbar(e.message, { variant: 'error', anchorOrigin: { horizontal: 'center', vertical: 'top' } })
    })
    setPassword('')
    handleClose()
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ marginLeft: "30px" }}>
        <Time></Time>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ marginTop: "50px", gap: 100, display: "flex" }}>
          <Button sx={kind === 'start' ? selectKindStyle : defaultStyle} variant="contained" onClick={() => setKind("start")}>出勤</Button>
          <Button sx={kind === 'end' ? selectKindStyle : defaultStyle} variant="contained" onClick={() => setKind("end")}>退勤</Button>
        </div>
        <div style={{ marginTop: "30px", gap: 50, display: "flex" }}>
          <Button variant="contained" sx={{ backgroundColor: "gray", width: "200px" }} >タイムカード</Button>
          <Button variant="contained" sx={{ backgroundColor: "gray", width: "200px" }} >システムのお問い合わせ</Button>
          <Button variant="contained" sx={{ backgroundColor: "gray", width: "200px" }} >ヘルプ</Button>
          <Button variant="contained" sx={{ backgroundColor: "gray", width: "200px" }} >パスワード変更</Button>
        </div>
        <div style={{ marginTop: "60px", gap: 30, display: "flex" }}>
          {(users ?? []).map((user) => (
            <Button key={user.id} variant="contained" sx={{ backgroundColor: "green" }} onClick={() => onClickUserName(user)} disabled={!kind}>{user.name}</Button>
          ))}
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" marginLeft={"100px"}>
            {selectedUser?.id}: {selectedUser?.name}
          </Typography>
          <TextField
            label="Password"
            type="password"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value);
            }}
            value={password}
            style={{ marginLeft: "100px", marginBottom: "20px" }}
          />
          <div style={{ gap: 50, display: "flex" }}>
            <Button sx={{ width: "150px" }} variant="contained" onClick={handleClose}>キャンセル</Button>
            <Button sx={{ width: "150px" }} variant="contained" onClick={onClickOk}>OK</Button>
          </div>
        </Box>
      </Modal>
      <div style={{
        backgroundColor: '#e0e0e0', marginTop: '30px', borderRadius: 30, padding: '20px',
        width: 'fit-content', overflowY: 'auto', height: '250px', marginLeft: 'auto', marginRight: '100px'
      }}>
        {(attendance ? [...attendance].reverse() : []).map((a, i) => (
          <div key={a.id + i}>{display(a)}</div>
        ))}
      </div>
    </>
  );
}
