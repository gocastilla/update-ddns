# Update DDNS

## Current avaliable DDNS providers

- Google Domains

## Example

```typescript
import { updateDDNS, Providers, Credentials, Domain } from 'update-ddns';

const credentials: Credentials = {
  username: 'u53rn4m3',
  password: 'p455w0rd'
};

const domain: Domain = {
  address: 'example.com'
};

updateDDNS(Providers.GoogleDomains, credentials, domain)
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

Lorem Ipsum bla bla bla
