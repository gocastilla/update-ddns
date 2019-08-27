"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Providers = {
    GoogleDomains: function (credentials, address, ip) {
        return "https://" + credentials.username + ":" + credentials.password + "@domains.google.com/nic/update?hostname=" + address + "&myip=" + ip;
    }
};
