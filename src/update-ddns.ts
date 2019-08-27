import { Credentials } from './interfaces/credentials.interface';
import { Domain } from './interfaces/domain.interface';
import request from 'request';

function getDynamicIp(ip?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (ip) {
      resolve(ip);
    } else {
      request(
        'https://domains.google.com/checkip',
        (error: any, response: any, body: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(body);
          }
        }
      );
    }
  });
}

function getDomainIp(domain: string): Promise<string> {
  return new Promise((resolve, reject) => {
    request(domain, (error: any, response: any, body: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(response.connection.remoteAddress);
      }
    });
  });
}

function checkIPs(dynamicIp: string, domainIp: string): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    if (dynamicIp != domainIp) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}

function update(
  provider: Function,
  credentials: Credentials,
  domain: Domain,
  dynamicIp: string
) {
  return new Promise(async (resolve, reject) => {
    const url = provider(credentials, domain.address, dynamicIp);
    request(url, (error: any, response: any, body: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}

export function updateDDNS(
  provider: Function,
  credentials: Credentials,
  domain: Domain,
  ip?: string
) {
  return new Promise(async (resolve, reject) => {
    getDynamicIp(ip)
      .then(dynamicIp => {
        getDomainIp(domain.addressToCheck || domain.address)
          .then(domainIp => {
            if (domain.disableCheck) {
              checkIPs(dynamicIp, domainIp)
                .then(needAnUpdate => {
                  if (needAnUpdate) {
                    update(provider, credentials, domain, dynamicIp)
                      .then(response =>
                        resolve({
                          code: 'updated',
                          newIp: dynamicIp,
                          serverResponse: response
                        })
                      )
                      .catch(error =>
                        reject({
                          code: 'error',
                          function: 'update()',
                          error
                        })
                      );
                  } else {
                    resolve({
                      code: 'no-need-to-update',
                      currentIp: domainIp
                    });
                  }
                })
                .catch(error =>
                  reject({
                    code: 'error',
                    function: 'checkIPs()',
                    error
                  })
                );
            } else {
              update(provider, credentials, domain, dynamicIp)
                .then(response =>
                  resolve({
                    code: 'updated',
                    newIp: dynamicIp,
                    serverResponse: response
                  })
                )
                .catch(error =>
                  reject({
                    code: 'error',
                    function: 'update()',
                    error
                  })
                );
            }
          })
          .catch(error =>
            reject({
              code: 'error',
              function: 'getDomainIp()',
              error
            })
          );
      })
      .catch(error =>
        reject({
          code: 'error',
          function: 'getDynamicIp()',
          error
        })
      );
  });
}
