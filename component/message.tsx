const Message: any = (props: any) => {

  const {isMy , id, name, text, image} = props

  return (
    <div key={id} className="chat-message w-max-[60px]">
      <div className={`flex  ${isMy ? 'justify-end items-end' : 'items-start'}`}>
        <div className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${isMy ? 'items-end order-1' : 'items-start order-2'}`}>
          <div>
            <p className="font-semibold text-xs">{name}</p>
            <span className={`break-word px-4 py-2 rounded-lg inline-block ${isMy ? 'rounded-br-none bg-blue-600 text-white' : 'rounded-bl-none bg-gray-300 text-gray-600'}`}>
              {text}
            </span>
          </div>
        </div>
        <img src={image} alt="My profile" className="w-6 h-6 rounded-full order-2"/>
      </div>
    </div>
  )

}

export default Message
