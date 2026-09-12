const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const getGenieAcsHeaders = `
const getGenieAcsHeaders = () => {
  const user = process.env.GENIEACS_USER || '';
  const password = process.env.GENIEACS_PASSWORD || '';
  return {
    'Authorization': 'Basic ' + Buffer.from(user + ':' + password).toString('base64'),
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

const callGenieAcs = async (path, options = {}) => {
  const acsUrl = process.env.GENIEACS_URL;
  if (!acsUrl) return null;
  const url = \`\${acsUrl}\${path}\`;
  const res = await fetch(url, {
    ...options,
    headers: { ...getGenieAcsHeaders(), ...options.headers }
  });
  if (!res.ok) throw new Error(\`GenieACS API error: \${res.status} \${res.statusText}\`);
  if (res.status === 204) return null;
  
  // GenieACS might return empty body on some requests
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const mapGenieAcsDeviceToAppFormat = (device) => {
  const getParam = (path) => {
    try {
      const parts = path.split('.');
      let current = device;
      for (const part of parts) {
        if (!current) return undefined;
        current = current[part];
      }
      return current?._value;
    } catch {
      return undefined;
    }
  };

  const manufacturer = getParam('Device.DeviceInfo.Manufacturer') || getParam('InternetGatewayDevice.DeviceInfo.Manufacturer') || 'Unknown';
  const productClass = getParam('Device.DeviceInfo.ProductClass') || getParam('InternetGatewayDevice.DeviceInfo.ProductClass') || 'Unknown';
  const serialNumber = getParam('Device.DeviceInfo.SerialNumber') || getParam('InternetGatewayDevice.DeviceInfo.SerialNumber') || device._id;
  const mac = getParam('Device.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.MACAddress') || getParam('InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.MACAddress') || '00:00:00:00:00:00';
  const ip = getParam('Device.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.ExternalIPAddress') || getParam('InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.ExternalIPAddress') || '0.0.0.0';
  const uptimeSeconds = getParam('Device.DeviceInfo.UpTime') || getParam('InternetGatewayDevice.DeviceInfo.UpTime') || 0;
  
  const rssi = parseFloat(getParam('Device.Optical.Interface.1.LowerReceivePower') || getParam('InternetGatewayDevice.WANDevice.1.WANDSLInterfaceConfig.Status') || '-19.5');
  
  const lastInform = device._lastInform || new Date().toISOString();
  const isOnline = (new Date().getTime() - new Date(lastInform).getTime()) < 3600000;
  
  return {
    _id: device._id,
    manufacturer,
    productClass,
    serialNumber,
    mac,
    ip,
    lastInform,
    status: isOnline ? 'online' : 'offline',
    rssi,
    snr: 40.0,
    uptime: \`\${Math.floor(uptimeSeconds / 86400)} dias, \${Math.floor((uptimeSeconds % 86400) / 3600)} horas\`,
    ssid: getParam('Device.WiFi.SSID.1.SSID') || getParam('InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID') || 'WIFI_REDE',
    wifiPassword: '***',
    wifiChannel: parseInt(getParam('Device.WiFi.Radio.1.Channel') || '1'),
    wifiBand: 'Dual-Band',
    lanClients: parseInt(getParam('Device.Hosts.HostNumberOfEntries') || '2'),
    tempLaser: '40.0 °C',
    vccVolts: '3.3 V'
  };
};
`;

content = content.replace('let genieacsDevices_mock: GenieACSDevice[] = [', getGenieAcsHeaders + '\nlet genieacsDevices_mock: GenieACSDevice[] = [');
fs.writeFileSync('server.ts', content);
