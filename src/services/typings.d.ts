declare namespace APIBASE {
  type BASE = {
    code: number;
    message: string;
    data: any;
  };
  type ANTTABLE = {
    data: [];
    success: boolean;
    total: number;
  };
  type TableQuery = {
    pageSize?: number | undefined;
    current?: number | undefined;
  };
}

declare namespace Websocket {
  type Message = {
    action: string;
    user: number;
    data: any;
  };
  type OnlineUser = {
    username: string;
    id: number;
  }[];

  type MessageList = {
    id: number;
    message: any;
  };
}
