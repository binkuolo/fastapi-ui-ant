declare namespace ROLE {
  type RoleItem = {
    id: number;
    key: number;
    role_name: string;
    role_status: boolean;
    role_desc: string;
  };
  type CreateRole = {
    role_name: string;
    role_status?: boolean;
    role_desc?: string;
  };
  type RoleOptions = {
    label: string | number;
    value: string | number;
  };
  type UpdateRole = {
    id: number;
    role_name: string;
    role_status: boolean;
    role_desc: string;
  };
  interface ResRoleList extends APIBASE.ANTTABLE {
    data: RoleItem[];
  }
  type AllAndUserRoel = {
    all_role: RoleOptions[];
    user_roles: number[];
  };
  interface AllRoleData extends APIBASE.BASE {
    data: AllAndUserRoel;
  }
}

declare namespace Access {
  type AccessItem = {
    title: string;
    key: string;
    children: AccessItem[] | [];
  };
  type AccessData = {
    all_access: AccessItem[];
    role_access: string[];
  };
  type SetAccess = {
    role_id: number;
    access: number | string[];
  };
  interface ResAccess extends APIBASE.BASE {
    data: AccessData;
  }
}
