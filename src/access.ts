/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import allRouter from '../config/routes';

export default function access(initialState: { currentUser?: USER.UserInfo | undefined }) {
  const { currentUser } = initialState || {};
  const base = {};
  function getBase(data: any[]) {
    data.forEach((ele: { access: any; routes: any }) => {
      if (ele.access) {
        Object.assign(base, {
          [ele.access]:
            currentUser?.user_type === true
              ? true
              : currentUser?.scopes.indexOf(ele.access) === -1
              ? false
              : true,
        });
      }
      if (ele.routes) {
        getBase(ele.routes);
      }
    });
  }
  getBase(allRouter);
  return base;
}
