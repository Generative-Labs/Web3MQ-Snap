
export type SendNotifyMessageRpcDto = {
  message: string
}

export async function sendNotifyMessage(payload: SendNotifyMessageRpcDto) {
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
    throw new Error(error);
  }
}
