import { useEffect, useState } from 'react';
import {useRouter} from "next/router";
import {useIdleTimer} from "react-idle-timer";


export const useAutoLogout = () => {
    const [lastActivityTime, setLastActivityTime] = useState(null);
    const router = useRouter()
   useIdleTimer({
        timeout: 14400000, // 4 hours in milliseconds
        onIdle: () => {
            setLastActivityTime(null);
            localStorage.clear()
            router.push('/login')
        },
    });
}