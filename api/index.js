import board from '../db/board.json'
export default {
	async fetch(
		request,
		env,
		ctx
	) {
		return new Response(JSON.stringify(board),{
			headers: {
				'content-type': 'application/json;charset=UTF-8'
			}
		});
	},
};
