import { SERVER_ENDPOINT } from 'api/server-url'
import { createContext, useContext, useEffect } from 'react'
import { io } from 'socket.io-client'

const socket = io(SERVER_ENDPOINT, {
  transports: ['websocket', 'polling'],
})

const SocketContext = createContext<any>(null)

export const SocketProvider = (props:any) => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket connected')
    })

    return () => {
      socket.off('connect')
    }
  }, [])

  return <SocketContext.Provider value={{ appSocket: socket }}>{props.children}</SocketContext.Provider>
}

export const useSocket = () => {
  const { appSocket } = useContext(SocketContext)
  return {
    appSocket,
  }
}
