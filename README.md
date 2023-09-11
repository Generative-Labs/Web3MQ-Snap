# @web3mq/snap

web3mq snap provides more possibilities for building web3 social dapps

You can familiarize yourself with mq-web3 snap based on the following example

Before starting, you need to install [MetaMask](https://metamask.io/download/) on your browser. After the extension is installed, execute the following code in your dapp to install the `@web3mq/snap`

Examples: https://web3mq-snap-demo.pages.dev/

## features:

- register / connect to web3mq network
- Create a group chat room
- Get the channels you created or joined
- Search user in web3mq
- Search for users in web3mq by eth address
- Send message to user or group channel
- Get the chat history of a chat room
- follow / unfollow web3mq user
- View your followers and followers

## Methods

| name                      | type     | Parameters Description                                                                                                             | response                                                                                           |
| ------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| checkUserExist            | function | [CheckUserExistParams](#CheckUserExistParams)                                                                                      | Promise:[CheckUserExistResponse](#CheckUserExistResponse)                                          |
| getMainKeySignContent     | function | [GetMainKeySignContentParams](#GetMainKeySignContentParams)                                                                        | Promise:[GetMainKeySignContentResponse](#GetMainKeySignContentResponse)                            |
| getMainKeypairBySignature | function | [GetMainKeypairParams](#GetMainKeypairParams)                                                                                      | Promise:[MainKeypairType](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/types/#mainkeypairtype)   |
| getRegisterSignContent    | function | [GetRegisterSignContentParams](#GetRegisterSignContentParams)                                                                      | Promise:[GetRegisterSignContentResponse](#GetRegisterSignContentResponse)                          |
| registerToWeb3MQNetwork   | function | [RegisterBySignParams](#RegisterBySignParams)                                                                                      | Promise:void                                                                                       |
| connectToWeb3MQ           | function | [ConnectToWeb3MQParams](#ConnectToWeb3MQParams)                                                                                    | Promise:void                                                                                       |
| creatRoom                 | function | [CreateRoomParams](#CreateRoomParams)                                                                                              | Promise:true                                                                                       |
| getChannelList            | function | [GetChannelListParams](#GetChannelListParams)                                                                                      | Promise:[channelitemtype](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/types/#channelitemtype)[] |
| sendNotifyMessage         | function | [SendNotifyMessageParams](#SendNotifyMessageParams)                                                                                | Promise:void                                                                                       |
| sendMessage               | function | [SendMessageParams](#SendMessageParams)                                                                                            | Promise:true                                                                                       |
| searchUser                | function | [SearchUserParams](#SearchUserParams)                                                                                              | Promise:[SearchUserResponse](#SearchUserResponse)                                                  |
| getContactList            | function | [PageParams](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/types/#pageparams)                                                     | Promise:[GetContactListResponse](#GetContactListResponse)                                          |
| getFollowerList           | function | [PageParams](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/types/#pageparams)                                                     | Promise:[GetContactListResponse](#GetContactListResponse)                                          |
| getFollowingList          | function | [PageParams](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/types/#pageparams)                                                     | Promise:[GetContactListResponse](#GetContactListResponse)                                          |
| requestFollow             | function | [RequestFollowParams](#RequestFollowParams)                                                                                        | Promise:bool                                                                                       |
| followOperation           | function | [PublishNotificationToFollowersParams](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/types/#publishnotificationtofollowersparams) | Promise:bool                                                                                       |
| disconnect                | function | -                                                                                                                                  | -                                                                                                  |
| exportWeb3MQKeys          | function | -                                                                                                                                  | Promise:[ExportWeb3MQKeysResponse](#ExportWeb3MQKeysResponse)                                      |
| clearWeb3MQKeys           | function | -                                                                                                                                  | -                                                                                                  |
| getFollowSignContent      | function | [GetFollowSignContentParams](#GetFollowSignContentParams)                                                                          | Promise:[GetFollowSignContentResponse](#GetFollowSignContentResponse)                              |
| getMessageList            | function | [GetMessageListParams](#GetMessageListParams)                                                                                      | Promise:[GetMessageListResponse](#GetMessageListResponse)                                          |

## type list

### CheckUserExistParams

| name    | type   | format          | desc           | required | eg         |
| ------- | ------ | --------------- | -------------- | -------- | ---------- |
| address | string | 0x0000000000001 | wallet address | true     | "0x000000" |

### CheckUserExistResponse

```json
[
  {
    "userid": "user:daeb1886610c47430790cf1f20cba93936d418adba5857e678210c40",
    "userExist": true
  }
]
```

### GetMainKeySignContentParams

| name     | type   | format          | desc           | required | eg         |
| -------- | ------ | --------------- | -------------- | -------- | ---------- |
| address  | string | 0x0000000000001 | wallet address | true     | "0x000000" |
| password | string | -               | Login password | true     | -          |

### GetMainKeySignContentResponse

<!-- | name        | type   | format | desc         | eg  | -->
<!-- | ----------- | ------ | ------ | ------------ | --- | -->
<!-- | signContent | string | -      | sign content | -   | -->

```ts
const response = {
  signContent: `
  Signing this message will allow this app to decrypt messages in the Web3MQ protocol for the following address: 0x6b6ff43d0568eb905b5eefb09082899800b1fbd4. This won’t cost you anything.

  If your Web3MQ wallet-associated password and this signature is exposed to any malicious app, this would result in exposure of Web3MQ account access and encryption keys, and the attacker would be able to read your messages.,

  In the event of such an incident, don’t panic. You can call Web3MQ’s key revoke API and service to revoke access to the exposed encryption key and generate a new one!

  Nonce: NDI3ODI4YTBmNjJmYjBkNDQ1MjUzMTRmODJjMzRhNzk0MDFkMjVhODE0OWFhOWYyYzM0YTdjYjA=`,
};
```

### GetMainKeypairParams

| name      | type   | format | desc                  | required | eg  |
| --------- | ------ | ------ | --------------------- | -------- | --- |
| signature | string | -      | eth personal_sign res | true     | -   |
| password  | string | -      | Login password        | true     | -   |

### GetMainKeysResponse

```json
{
  "publicKey": "f3e9b047fd2171ac1df0e328b2b06100a788d7195397d63096893ff4daa50de1",
  "secretKey": "IXVCVAw9uvK8Ulm6us9OplvjRin3N+o+Q0Hpv9yOGOtLFW9+nHp9TRyA1B9jvRWtLSB1ICvG5G9HASvqQ7RF/FIT1KnpgkCX4QlXHiyEn/4="
}
```

### GetRegisterSignContentParams

| name           | type   | format                                                                                  | desc                    | required | eg                     |
| -------------- | ------ | --------------------------------------------------------------------------------------- | ----------------------- | -------- | ---------------------- |
| walletType     | 'eth'  | 'eth'                                                                                   | "eth"                   | true     |
| walletAddress  | string | 0x0000000000001                                                                         | wallet address          | true     | "0x000000"             |
| mainPublicKey  | string | [PublicKey](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/standards/#master-publickey) | master public key       | true     | -                      |
| signContentURI | string | -                                                                                       | url of the current page | false    | window.location.origin |
| userid         | string | [userid](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/standards/#userid)              | useid of user           | true     | "user:xxx"             |

### GetRegisterSignContentResponse

<!-- | name         | type   | format | desc                                      | eg  |
| ------------ | ------ | ------ | ----------------------------------------- | --- |
| signContent  | string | -      | sign content                              | -   |
| registerTime | number | -      | Timestamp of when the signcontent was got | -   | -->

```json
{
  "signContent": "Web3MQ wants you to sign in with your Ethereum account:\n0x6b6ff43d0568eb905b5eefb09082899800b1fbd4\nFor Web3MQ register\nURI: Web3MQ - snaps\nVersion: 1\n\nNonce: 51560ee1bc7f1f6eaa255610306d7be413dc9a6dc35b865a98b24d3f\nIssued At: 12/07/2023 15:59",
  "registerTime": 1689148740758
}
```

### RegisterBySignParams

| name                | type   | format                                                                                    | desc                                      | required   | eg         |
| ------------------- | ------ | ----------------------------------------------------------------------------------------- | ----------------------------------------- | ---------- | ---------- |
| avatarUrl           | string | -                                                                                         | avatar resource                           | false      | -          |
| walletAddress       | string | 0x0000000000001                                                                           | wallet address                            | "0x000000" | "0x000000" |
| mainPrivateKey      | string | [PrivateKey](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/standards/#master-privatekey) | master private key                        | true       | -          |
| mainPublicKey       | string | [PublicKey](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/standards/#master-publickey)   | master public key                         | true       | -          |
| nickname            | string | -                                                                                         | nickname                                  | false      | -          |
| signature           | string | [signature](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/standards/#wallet-sign)        | content of sign                           | true       | -          |
| userid              | string | [userid](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/standards/#userid)                | useid of user                             | "user:xxx" | "user:xxx" |
| registerSignContent | string | [userid](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/standards/#userid)                | useid of user                             | true       | "user:xxx" |
| registerTime        | number | -                                                                                         | Timestamp of when the signcontent was got | true       | -          |
| password            | string | -                                                                                         | Login password                            | true       | -          |

### ConnectToWeb3MQParams

| name                   | type   | format                                                                                    | desc                                          | required   | eg         |
| ---------------------- | ------ | ----------------------------------------------------------------------------------------- | --------------------------------------------- | ---------- | ---------- |
| walletAddress          | string | 0x0000000000001                                                                           | wallet address                                | "0x000000" | "0x000000" |
| mainPrivateKey         | string | [PrivateKey](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/standards/#master-privatekey) | master private key                            | -          | -          |
| mainPublicKey          | string | [PublicKey](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/standards/#master-publickey)   | master public key                             | -          | -          |
| password               | string | -                                                                                         | Login password                                | -          | -          |
| pubkeyExpiredTimestamp | number | -                                                                                         | the expiration time of the temporary key pair | -          | -          |
| userid                 | string | [userid](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/standards/#userid)                | useid of user                                 | "user:xxx" | "user:xxx" |

### CreateRoomParams

| name       | type   | format | desc       | required | eg          |
| ---------- | ------ | ------ | ---------- | -------- | ----------- |
| group_name | string | -      | group name | false    | test room 1 |

### CreateRoomResponse

```json
{
  "avatar_base64": "",
  "avatar_url": "",
  "group_name": "group 1",
  "groupid": "group:dc6dfb6cb100c52499319e79de0429ddf90fb4db"
}
```

### GetChannelListParams

| name    | type       | format                                                                         | desc           | required | eg                                 |
| ------- | ---------- | ------------------------------------------------------------------------------ | -------------- | -------- | ---------------------------------- |
| options | PageParams | [PageParams](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/types/#pageparams) | wallet address | true     | { options: { page: 1, size: 10 } } |

### GetChannelListResponse

```json
[
  {
    "topic": "group:dc6dfb6cb100c52499319e79de0429ddf90fb4db",
    "topic_type": "group",
    "chatid": "group:dc6dfb6cb100c52499319e79de0429ddf90fb4db",
    "chat_type": "group",
    "chat_name": "group 1",
    "avatar_url": "",
    "avatar_base64": ""
  }
]
```

### SearchUserParams

| name    | type   | format          | desc           | required | eg         |
| ------- | ------ | --------------- | -------------- | -------- | ---------- |
| address | string | 0x0000000000001 | wallet address | true     | "0x000000" |

### SearchUserResponse

```json
[
  {
    "avatar_url": "",
    "nickname": "",
    "userid": "user:daeb1886610c47430790cf1f20cba93936d418adba5857e678210c40",
    "wallet_address": "0x7236b0f4f1409afdc7c9fc446943a7b84b6513a1",
    "wallet_type": "eth"
  }
]
```

### GetContactListResponse

> GetContactList | GetFollowerList | GetFollowingList Response

```json
{
  "total_count": 5,
  "user_list": [
    {
      "avatar_url": "",
      "follow_status": "follow_each",
      "nickname": "wei)2",
      "permissions": {},
      "userid": "user:83f78ac24920a66c4770b1c207c7e12f8ebe6e14adebbcfdab7aaa86",
      "wallet_address": "0x9b6a5a1dd55ea481f76b782862e7df2977dffe6c",
      "wallet_type": "eth"
    },
    {
      "avatar_url": "",
      "follow_status": "follow_each",
      "nickname": "",
      "permissions": {},
      "userid": "user:a4ceca2ceaf9f939ad41fcc0867b6fc1f03127ffc665055d0d959707",
      "wallet_address": "0xa126f99e0defc3bfa963064314c4b1d54c872dcc",
      "wallet_type": "eth"
    },
    {
      "avatar_url": "",
      "follow_status": "following",
      "nickname": "",
      "permissions": {},
      "userid": "user:daeb1886610c47430790cf1f20cba93936d418adba5857e678210c40",
      "wallet_address": "0x7236b0f4f1409afdc7c9fc446943a7b84b6513a1",
      "wallet_type": "eth"
    },
    {
      "avatar_url": "",
      "follow_status": "follow_each",
      "nickname": "",
      "permissions": {},
      "userid": "user:dc3c88cad1ce9534264a75073cfa5c3cce4ee39c088070f00be09129",
      "wallet_address": "0xb627ef9f7521c562b49f19cdfa4b88d12607c33a",
      "wallet_type": "eth"
    },
    {
      "avatar_url": "",
      "follow_status": "follow_each",
      "nickname": "",
      "permissions": {},
      "userid": "user:05c1eddf975930c9454cfb850955c3cd4491c900a24e2de47580084f",
      "wallet_address": "0x37c7c30b6982c754678e65bd076403fb859b842d",
      "wallet_type": "eth"
    }
  ]
}
```

### ExportWeb3MQKeysResponse

```json
{
  "privateKey": "535d85b58b38cdabbd50c5c2734c4639ecfe5d0964f1a17231d8a648071aab55",
  "publicKey": "4745fe265d7c36c1e039132dc39c282a8b796777d80413e480b7d9c1bfb67c12",
  "userid": "user:daeb1886610c47430790cf1f20cba93936d418adba5857e678210c40",
  "walletAddress": "0x7236b0f4f1409afdc7c9fc446943a7b84b6513a1",
  "mainPrivateKey": "dCtEVQxkvvXoUVe5us4SoQ/lEn2rMexqQkznuNuOErxIEz56mHt1SBjThklhvBGsenN5c3ibsjMSCiHtE75Or/HPHB7J7ugrNAcW/C+V374=",
  "mainPublicKey": "e587ab649db08c55ee348a7dbe568661c6790523896a4af56ca9aa7fab10514e",
  "didKey": "eth:0x7236b0f4f1409afdc7c9fc446943a7b84b6513a1",
  "pubkeyExpiredTimestamp": "0"
}
```

### RequestFollowParams

| name     | type   | format                           | desc                  | required | eg    |
| -------- | ------ | -------------------------------- | --------------------- | -------- | ----- |
| targetId | string | topic \| userid \| walletaddress | group topic or userid | true     | -     |
| content  | string | -                                | say hello             | false    | hello |

### FollowOperationParams

| name          | type                 | format                                                                             | desc                                      | required | eg     |
| ------------- | -------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------- | -------- | ------ |
| targetId      | string               | topic \| userid \| walletaddress                                                   | group topic or userid                     | true     | -      |
| content       | string               | -                                                                                  | say hello                                 | false    | hello  |
| action        | 'follow' \| 'cancel' | -                                                                                  | follow action type                        | true     | follow |
| signature     | string               | [signature](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/standards/#wallet-sign) | sign res                                  | true     | -      |
| signContent   | string               | -                                                                                  | content of sign                           | true     | -      |
| signTimestamp | number               | -                                                                                  | Timestamp of when the signcontent was got | true     | -      |

### GetMessageListParams

| name    | type       | format                                                                         | desc                  | required | eg                                 |
| ------- | ---------- | ------------------------------------------------------------------------------ | --------------------- | -------- | ---------------------------------- |
| options | PageParams | [PageParams](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/types/#pageparams) | wallet address        | true     | { options: { page: 1, size: 10 } } |
| topic   | PageParams | -                                                                              | group topic or userid | true     | user:XXX \| group:xxx              |

### GetMessageListResponse

```json
[
  {
    "_id": 1,
    "id": 1,
    "indexId": 1,
    "content": "Message from snap ",
    "senderId": "user:daeb1886610c47430790cf1f20cba93936d418adba5857e678210c40",
    "username": "",
    "avatar": "assets/imgs/doe.png",
    "date": "2023-6-30",
    "timestamp": "2:22",
    "system": false,
    "saved": false,
    "distributed": true,
    "seen": true,
    "failure": false
  }
]
```

### GetFollowSignContentParams

| name          | type                 | format                                                                     | desc                 | required | eg         |
| ------------- | -------------------- | -------------------------------------------------------------------------- | -------------------- | -------- | ---------- |
| walletType    | 'eth'                | 'eth'                                                                      | "eth"                | true     |
| walletAddress | string               | 0x0000000000001                                                            | wallet address       | true     | "0x000000" |
| action        | 'follow' \| 'cancel' | -                                                                          | follow action type   | true     | follow     |
| targetUserid  | string               | [userid](https://docs.web3mq.com/docs/Web3MQ-SDK/JS-SDK/standards/#userid) | useid of target user | true     | "user:xxx" |

### GetFollowSignContentResponse

```json
{
  "signContent": "\n    Web3MQ wants you to sign in with your eth account:\n    0x7236b0f4f1409afdc7c9fc446943a7b84b6513a1\n\n    For follow signature\n\n    Nonce: 95873384cc38d9c5750286143f5123b94c5b4ce549162450ad9e08a2\n    Issued At: 2023/07/12 16:25",
  "signTimestamp": 1689150327546
}
```

### SendNotifyMessageParams

| name    | type   | format | desc                 | required | eg  |
| ------- | ------ | ------ | -------------------- | -------- | --- |
| message | string | -      | notification message | true     | -   |

### SendMessageParams

| name    | type   | format                           | desc                  | required | eg  |
| ------- | ------ | -------------------------------- | --------------------- | -------- | --- |
| message | string | -                                | message               | true     | -   |
| topic   | string | topic \| userid \| walletaddress | group topic or userid | true     | -   |
