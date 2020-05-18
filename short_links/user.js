class User
{
	/* Default Users constructor
	 * Arguments:
	 *   - None
	 * Returns:
	 *   - None
	*/
	constructor()
	{
		/* users id */
		this.id = Date.now();

		/* users links dict. 
		   Key: original link
		   Value: short link */
		this.links = {};
	}

	/* Add links to users links dict
	 * Arguments:
	 *    - original link and short link
	 *        original_link, short_link
	 * Returns:
	 *    - None
	*/
	add_link(original_link, short_link)
	{
		/* adding links to dict*/
		this.links[original_link] = short_link;
	}

	print_links()
	{
		/* printing users id */
		console.log('Users id: ' + this.id)

		/* getting users links*/
		for (const [key, value] of Object.entries(this.links))
		{
			console.log('Original link: ' + key);
			console.log('Short link: ' + value);
		}

	}
}

exports.User = User;