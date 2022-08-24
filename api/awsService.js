import awsIot from'aws-iot-device-sdk'

export const iotDevice  =  awsIot.device({
    keyPath:'./certs/16ddbb94afdc87f357590e2d9c42e2c6a7740b0e3391d17eaab4138b42eaf004-private.pem.key',
    certPath: './certs/16ddbb94afdc87f357590e2d9c42e2c6a7740b0e3391d17eaab4138b42eaf004-certificate.pem.crt',
    caPath: './certs/AmazonRootCA1.pem',
    host: 'ausfynwe7ii6h-ats.iot.us-east-1.amazonaws.com',
    clientId: 'trafLigths',
    region: 'us-east-1',
});
