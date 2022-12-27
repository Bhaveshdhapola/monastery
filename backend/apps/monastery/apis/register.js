/**
 * Registers a new user. 
 * (C) 2015 TekMonks. All rights reserved.
 */
const totp = require(`${APP_CONSTANTS.LIB_DIR}/totp.js`);
const userid = require(`${APP_CONSTANTS.LIB_DIR}/userid.js`);

exports.doService = async jsonReq => {
	if (!validateRequest(jsonReq)) {LOG.error("Validation failure."); return CONSTANTS.FALSE_RESULT;}
	let products=[];
	LOG.debug("Got register request for ID: " + jsonReq.id);

	if (!totp.verifyTOTP(jsonReq.totpSecret, jsonReq.totpCode)) {
		LOG.error(`Unable to register: ${jsonReq.name}, ID: ${jsonReq.id}, wrong totp code`);
		return CONSTANTS.FALSE_RESULT;
	}

	await exports.updateOrgAndDomain(jsonReq);	// set domain and override org if needed

	const existingUsersForDomain = await userid.getUsersForDomain(_getRootDomain(jsonReq)), 
		existingUsersForOrg = await userid.getUsersForOrg(jsonReq.org), 
		notFirstUserForThisDomain = existingUsersForDomain && existingUsersForDomain.result && existingUsersForDomain.users.length,
		notFirstUserForThisOrg = existingUsersForOrg && existingUsersForOrg.result && existingUsersForOrg.users.length,
		approved =  notFirstUserForThisOrg||notFirstUserForThisDomain?0:1, 
		role = notFirstUserForThisOrg||notFirstUserForThisDomain?"user":"admin";

	const result = await userid.register(jsonReq.id, jsonReq.name, jsonReq.org, jsonReq.pwph, jsonReq.totpSecret, role, 
		approved,_getRootDomain(jsonReq));

	if (result.result) LOG.info(`User registered and logged in: ${jsonReq.name}, ID: ${jsonReq.id}`); else LOG.error(`Unable to register: ${jsonReq.name}, ID: ${jsonReq.id} DB error`);
       const result1 = await userid.getProducts();
		if(result1 && result1.products && result1.products.length > 0) for (let product of result1.products) products.push(product.product_name);

	return {result: result.result, "products":products,name: result.name, id: result.id, org: result.org, role: result.role, tokenflag: result.approved?true:false};
}

exports.updateOrgAndDomain = async jsonReq => {
	const rootDomain = _getRootDomain(jsonReq);
	const existingUsersForDomain = await userid.getUsersForDomain(rootDomain);
	LOG.info(JSON.stringify(rootDomain))
	LOG.info(JSON.stringify(existingUsersForDomain))

	if (existingUsersForDomain && existingUsersForDomain.result && existingUsersForDomain.users.length) 
		jsonReq.org = (await userid.getOrgForDomain(rootDomain))||jsonReq.org;	// if this domain already exists, override the org to the existing organization
	jsonReq.domain = rootDomain;
}

function _getRootDomain(jsonReq) {
	const domain = jsonReq.id.indexOf("@") != -1 ? jsonReq.id.substring(jsonReq.id.indexOf("@")+1) : "undefined"
	return domain;
}


const validateRequest = jsonReq => (jsonReq && jsonReq.pwph && jsonReq.id && jsonReq.name && jsonReq.org && jsonReq.totpSecret && jsonReq.totpCode);
