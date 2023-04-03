import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { io } from 'socket.io-client'
import { createRef, MutableRefObject, useEffect, useRef, useState } from 'react';
import { v4 as uuidV4 } from 'uuid'; 

interface iMessage {
  id: string;
  myId?: string;
  name: string;
  text: string;
}

interface iPayload {
  name: string;
  text: string;
}

const images = [
    'data:image/jpeg;base64,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',  
    'https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144',
  ]

const cursorImage = Math.floor(Math.random() * images.length)
const myImage = images[cursorImage]

const socket = io('http://localhost:3001');

const myId = uuidV4();

export default function Home() {

  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [messages, setMassage] = useState<iMessage[]>([]);

  function receivedMessage(message: iPayload) {
    const newMessage: iMessage = {
      id: uuidV4(),
      myId: myId,
      name: message.name,
      text: message.text,
    }
    setMassage([...messages, newMessage])
  }

  useEffect(() => {
    socket.on('msgToClient', (message: iPayload)=> {
      receivedMessage(message)
    })
  }, [messages, name, text]);

  useEffect(() => {
    if (!!name) setDisabled(false)
  },[name])

  useEffect(() => {
    setButtonDisabled(!text)
  },[text])

  const validateInput = () => {
    return name.length > 0 && text.length > 0
  }

  function sendMessage () {
    if (!!text) {
      console.log('[messages]',{name, text, myId})
      if(validateInput()) {
        const message: iPayload = {
          name, text
        }

        socket.emit('msgToServer', message)
        setText(' ')
      }
    }
  }

  function myMessage(msg: iMessage) {
    return (
      <div key={msg.id} className="flex w-full mt-2 space-x-3 max-w-xs">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
        <div>
          <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
            <p className=''>{msg.name}</p>
            <p className="text-sm">{msg.text}</p>
          </div>
          <span className="text-xs text-gray-500 leading-none">2 min ago</span>
        </div>
      </div>
    )
  }

  return (
    <div  className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 p-10">
      <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
        
        <div className="flex items-center justify-between py-3 border-b-2 border-gray-200">
          <div className="relative flex items-center space-x-4">
            <div className="relative">
                <span className="absolute text-green-500 right-0 bottom-0">
                  <svg width="20" height="20">
                      <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
                  </svg>
                </span>
              <img src={myImage} alt="" className="w-16 h-16 rounded-full"/>
            </div>
            <div className="flex flex-col leading-tight">
                <div className="text-2xl mt-1 flex items-center">
                  <input className="text-gray-700 mr-3 bg-gray-200 rounded-2xl px-4 py-2"
                    value={name}
                    onChange={ e => setName(e.target.value)}
                    placeholder="Insert your name"
                  />
                </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-grow h-0 p-4 gap-y-2 overflow-auto">

          {messages.map((message: iMessage) => {
            return (
              <div key={message.id}>

                { !!(message.myId === myId && message.name === name) ? (
                  <div key={message.id} className="chat-message">
                    <div className="flex items-end justify-end w-max-[60px]">
                      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                        <div>
                          <p className="font-semibold text-xs">{message.name}</p>
                          <span className="break-word px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                            {message.text}
                          </span>
                        </div>
                      </div>
                      <img src={myImage} alt="My profile" className="w-6 h-6 rounded-full order-2"/>
                    </div>
                  </div>
                ) : (
                  <div className="chat-message w-max-[60px]">
                    <div className="flex items-end">
                      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                        <p className="font-semibold text-xs">{message.name}</p>
                        <span className="break-word px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">
                          {message.text}
                        </span>
                      </div>
                      <img src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144" alt="My profile" className="w-6 h-6 rounded-full order-1"/>
                    </div>
                  </div>
                )}

              </div>
            )
          })}
        </div>
        

        {/* input message */}
        <div className="border-t-2 border-gray-200 px-4 pt-4 mb-4">
          <div className="relative flex">
            
            <input type="text" placeholder={disabled ? 'Enter your name in top' :'Write your message!'}
              onChange={ e => setText(e.target.value)}
              value={text}
              disabled={disabled}
              className="
                break-word w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-4 bg-blue-200 rounded-md py-3
                disabled:bg-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed
              "/>
            
            <div className="absolute right-0 items-center inset-y-0 flex">
              <button type="button"
                disabled={buttonDisabled}
                onClick={() => sendMessage()}
                className="
                  inline-flex items-center justify-center rounded-lg px-2 py-1 mr-2 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none
                  disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed
                ">
                <span className="font-bold">Send</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>        
  )
}

