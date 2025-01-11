import { v4 as uuidv4 } from 'uuid';

const getHeaders = (contentType) => {
	return {
		'X-Correlation-ID': uuidv4()+'_'+uuidv4(),
		'Accept': contentType,
		'Content-Type': contentType,
	};
};

export {
	getHeaders,
};
