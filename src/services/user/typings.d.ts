declare namespace USER {
  type AccountLogin = {
    account?: string;
    password?: string;
  };
  type CreateUser = {
    username: string;
    password: string;
    user_phone: string | null;
    user_status: boolean;
    remarks: string;
  };
  type Token = {
    token: string;
  };
  type UserInfo = {
    username: string;
    age: number;
    user_type: boolean;
    nickname: string;
    user_phone: string;
    user_email: string;
    full_name: string;
    user_status: boolean;
    scopes: string[];
    header_img: string;
    sex: number;
  };
  type UpdateUser = {
    id: number;
    username?: string;
    age?: number;
    user_type?: boolean;
    nickname?: string;
    user_phone?: string | null;
    user_email?: string | null;
    full_name?: string;
    password?: string | null;
    user_status?: boolean;
    header_img?: string;
    sex?: number;
    remarks?: string;
  };
  type SetUserRole = {
    user_id: number;
    roles: string[];
  };
  type UserItem = {
    key: number;
    id: number;
    username: string;
    age: number;
    user_type: boolean;
    nickname: string;
    user_phone: string;
    user_email: string;
    full_name: string;
    user_status: boolean;
    header_img: string;
    sex: number;
    remarks: string;
  };

  interface GetUserListQuery extends APIBASE.TableQuery {
    username?: string;
  }

  interface ResLogin extends APIBASE.BASE {
    data: Token;
  }
  interface ResGetUserInfo extends APIBASE.BASE {
    data: UserInfo;
  }
  interface ResGetUserList extends APIBASE.ANTTABLE {
    data: UserItem[];
  }
}
