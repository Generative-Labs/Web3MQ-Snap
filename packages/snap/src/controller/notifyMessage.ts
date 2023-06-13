
export type NotifyMessageRpcDto = {
  message: string
}

export async function sendNotifyMessage(payload: NotifyMessageRpcDto) {
  const { message } = payload;
  try {
    return snap.request({
      method: 'snap_notify',
      params: {
        type: 'inApp',
        message,
      },
    });
  } catch (error) {
    console.log(error.message, 'sendNotifyMessage error')
    throw new Error(error);
  }
}
