import Peer from 'peerjs'

const {
  log,
} = console

/**
 * @param {string} fromID 
 * @param {string} toID 
 * @param {MediaStream} fromStream
 * @param {(toStream: MediaStream) => void} onToStream
 */
const startPeerJSConnection = (fromID, toID, fromStream, onToStream) => {
  let from = fromID// && `${fromID}YEAR${new Date().getFullYear()}`
  let to = toID// && `${toID}YEAR${new Date().getFullYear()}`
  log(`(${from}, ${to})`)

  const peer = new Peer(from, { debug: 0 })

  peer.on('close', () => { log(`(${from}, ${to}): peer close`) })
  peer.on('disconnected', () => { log(`(${from}, ${to}): peer disconnected`) })
  peer.on('error', () => { log(`(${from}, ${to}): peer error`) })

  peer.on('open', () => {
    log(`(${from}, ${to}): peer open`)

    peer.on('call', call => {
      to = call.peer
      log(`(${from}, ${to}): peer open <-call`)

      call.on('error', () => { log(`(${from}, ${to}): peer open <-call error`) })
      call.on('close', () => { log(`(${from}, ${to}): peer open <-call close`) })

      call.on('stream', stream => {
        log(`(${from}, ${to}): peer open <-call stream`)
        onToStream(stream)
      })

      call.answer(fromStream)
    })

    if (to) {
      log(`(${from}, ${to}): peer open call->`)
      const call = peer.call(to, fromStream)

      call.on('error', () => { log(`(${from}, ${to}): peer open call-> error`) })
      call.on('close', () => { log(`(${from}, ${to}): peer open call-> close`) })

      call.on('stream', stream => {
        log(`(${from}, ${to}): peer open call-> stream`)
        onToStream(stream)
      })
    }
  })
}

export {
  startPeerJSConnection,
}
