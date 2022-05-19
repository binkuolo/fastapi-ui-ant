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
