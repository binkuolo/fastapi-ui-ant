import Base from '@/pages/user/Settings/components/Base';
import Bind from '@/pages/user/Settings/components/Bind';
import Notification from '@/pages/user/Settings/components/Notification';
import Security from '@/pages/user/Settings/components/Security';
import { Menu } from 'antd';
import { memo, useState } from 'react';
import styles from './style.less';

export default memo(() => {
  const [selectKey, setselectKey] = useState('base');
  const items = [
    { label: '基本设置', key: 'base' },
    { label: '安全设置', key: 'security' },
    { label: '账号绑定', key: 'binding' },
    { label: '新消息通知', key: 'notification' },
  ];
  return (
    <div className={styles.main}>
      <div className={styles.leftMenu}>
        <Menu
          mode={'inline'}
          selectedKeys={[selectKey]}
          onClick={({ key }) => {
            setselectKey(key);
          }}
          items={items}
        />
      </div>
      <div className={styles.right}>
        <div className={styles.title}>
          {items.filter((v) => v.key == selectKey).map((v) => v.label)}
        </div>
        {selectKey == 'base' && <Base />}
        {selectKey == 'security' && <Security />}
        {selectKey == 'binding' && <Bind />}
        {selectKey == 'notification' && <Notification />}
      </div>
    </div>
  );
});
