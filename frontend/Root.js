import React, {
  useRef,
  useState,
  useEffect,
  // types
  FunctionComponent,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from 'react'

import {
  startPeerJSConnection,
} from './webRTC'

import './Root.scss'

const {
  log,
} = console

const [, fromID, toID] = new URL(location.href).pathname.split('/')

/** @type {FunctionComponent<void>} */
const Root = () => {

  /** @type {MutableRefObject<HTMLVideoElement>} */
  const fromRef = useRef()
  /** @type {MutableRefObject<HTMLVideoElement>} */
  const toRef = useRef()

  /** @type {[MediaStream, Dispatch<SetStateAction<MediaStream>>]} */
  const [fromStream, setFromStream] = useState()
  /** @type {[MediaStream, Dispatch<SetStateAction<MediaStream>>]} */
  const [toStream, setToStream] = useState()

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(setFromStream)
  }, [])

  useEffect(() => {
    log(`fromStream: ${!!fromStream}`)
    if (fromStream) {
      fromRef.current.srcObject = fromStream
    }
  }, [fromStream])

  useEffect(() => {
    log(`toStream: ${!!toStream}`)
    if (toStream) {
      toRef.current.srcObject = toStream
    }
  }, [toStream])

  return (
    <div
      className={`Root`}
      onClick={() => {
        startPeerJSConnection(fromID, toID, fromStream, setToStream)
      }}
    >
      {!fromID && <div>Please use the URL format: "<code>/{!fromID ? <b>[from]</b> : <>from</>}/{!toID ? <b>[to]</b> : <>to</>}</code>"</div>}
      <video
        ref={fromRef}
        autoPlay
        playsInline
        muted
      />
      <video
        ref={toRef}
        autoPlay
        playsInline
      />
    </div>
  )
}

export default Root
