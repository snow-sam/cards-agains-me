import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";

const SERVER_URL = process.env.SERVER_HOST
const SERVER_PORT = process.env.SERVER_PORT

export const usePlayerSocket = (opts: typeof io.arguments) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(`${SERVER_URL}:${SERVER_PORT}`, opts)
        setSocket(newSocket)
        return () => {
            newSocket.disconnect();
            setSocket(null);
        }
    }, [])

    return socket
}