import https from 'https'
import querystring from 'querystring'

// https://paykassa.pro/docs/#api-SCI-sci_confirm_order

const mergeArray = (array1,array2) => {
  for(let item in array1) {
    array2[item] = array1[item];
  }
  return array2;
}

class PayKassaApi {

    // availible methods
    methods = [
        'sci_create_order',
        'sci_confirm_order',
        'api_get_shop_balance',
    ]

    constructor({api_id, api_key}) {
        this.api_id = api_id;
        this.api_key = api_key;
    }


    sendRequest(method, params, callback) {

        if (this.methods.indexOf(method) === -1) {
            throw new Error('wrong method name ' + method);
        };

        if (callback == null) {
            callback = params;
        };

        var data = {
            func: method,
            api_id	: this.api_id,
            api_key: this.api_key,
        };

        data = mergeArray(params, data);

        var body = querystring.stringify(data);

        var options = {
            host: 'paykassa.app',
            port: 443,
            path: '/api/0.5/index.php',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        };

        var request = https.request(options, function (response) {
            var result = '';
            response.setEncoding('utf8');

            response.on('data', function (chunk) {
                result += chunk;
            });

            // Listener for intializing callback after receiving complete response
            response.on('end', function () {
                try {
                    callback(JSON.parse(result));
                } catch (e) {
                    console.error(e);
                    callback(result);
                }
            });
        });

        request.write(body);
        request.end();
    }


}

 
export default PayKassaApi