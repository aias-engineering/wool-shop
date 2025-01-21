import { auth } from '@/auth';
import { getRequestConfig } from 'next-intl/server';
 
export default getRequestConfig(async () => {

  const session = await auth()
  const locale = session?.lang || 'nl';
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});