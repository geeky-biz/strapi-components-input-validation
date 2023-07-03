const { ApplicationError } = require("@strapi/utils").errors;

//Dummy function to exhibit validation of exchange rate
function isExchangeRateInvalid(val)
{
    return true;
}

//validations object that can hold input validations for all the various
//collection types. To add validation for a new collection type, simply add
// 'newCollection' : (data) => {...validation code here...}
const validations = {
    'transaction' : (data) => {
        const { payment } = data;
        if (payment?.exchange_rate && 
            isExchangeRateInvalid(payment.exchange_rate))
            throw new ApplicationError('Invalid payment.exchange_rate value.');
    }
}

const getCollectionNameFromRequestUrl = (reqUrl) => {
    if (reqUrl.includes('::'))
    {
        const after = reqUrl.split('::')[1];
        if (after.includes('.'))
            return after.split('.')[0]
        else
            return null;
    }
    else
        return null;
}


module.exports = ()=> {
    return async (ctx, next) => {
        //Perform input validations only for create & update requests
        if (ctx.request.method === 'PUT' || ctx.request.method === 'POST')
        {
            //Perform input validation only for requests coming to the Strapi Admin
            //content-manager
            if (ctx.request.url.includes('/content-manager/collection-types/api::') || 
            ctx.request.url.includes('/content-manager/single-types/api::'))
            {
                const apiName = getCollectionNameFromRequestUrl(ctx.request.url);
                if (Object.keys(validations).includes(apiName))
                {
                    let data = ctx.request.body;
                    await validations[apiName](data);
                }
            }
        }
        await next();
    }
}