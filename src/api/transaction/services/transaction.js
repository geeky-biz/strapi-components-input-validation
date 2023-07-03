'use strict';

/**
 * transaction service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::transaction.transaction');
