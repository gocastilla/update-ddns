import { Credentials } from './interfaces/credentials.interface';

export const Providers = {
  GoogleDomains: (credentials: Credentials, address: string, ip: string) => {
    return `https://${credentials.username}:${credentials.password}@domains.google.com/nic/update?hostname=${address}&myip=${ip}`;
  }
};
