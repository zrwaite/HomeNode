/* Interfaces */
interface imageGetQuery {
	id: string;
}
interface imagePostBody {
	//Body query interface for post request
	file_name: string;
	home_id: string;
}
interface imageDeleteBody {
	//Body query interface for delete request
	id: string;
}
export {imageGetQuery, imagePostBody, imageDeleteBody};