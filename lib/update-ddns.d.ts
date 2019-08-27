import { Credentials } from './interfaces/credentials.interface';
import { Domain } from './interfaces/domain.interface';
export declare function updateDDNS(provider: Function, credentials: Credentials, domain: Domain, ip?: string): Promise<unknown>;
