import response from "../../models/response";
export default function getResult(object: any, name: string, result: response) {
	//Create the returned result of a get request
	if (result.errors.length > 0) return result;
	if (object !== undefined && object !== null && object.length !== 0) {
		result.status = 200;
		result.success = true;
		result.response = {name: object};
	} else {
		result.status = 404;
		result.errors.push(name + " not found");
	}
	return result;
}
