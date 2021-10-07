import { param2Obj } from '@/utils/index';
import { setToken } from '@/utils/auth';

export const getTokenFrom = () => {
  const { token } = param2Obj(location.href);
  if (token) {
    setToken(token);
    const newUrl = location.href.split('?')[0];
    console.log(newUrl);
    window.location = `${newUrl}`;
  }
};
