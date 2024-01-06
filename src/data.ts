/* eslint-disable @typescript-eslint/no-explicit-any */
function sleep(time: number) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

export async function fetchPosts(): Promise<any[]> {
	await sleep(2000);
	const res = await fetch('https://jsonplaceholder.typicode.com/posts');
	if (res.ok) {
		return await res.json();
	}

	return [];
}

export async function fetchPostById(postId: number) {
	const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
	if (res.ok) {
		return await res.json();
	}

	return null;
}

export async function fetchUsers() {
	await sleep(2000);
	const res = await fetch('https://jsonplaceholder.typicode.com/users');
	if (res.ok) {
		return await res.json();
	}

	return [];
}

export async function fetchUserById(userId: number) {
	const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);

	if (res.ok) {
		return await res.json();
	}

	return null;
}

export async function fetchUserPosts(userId: number) {
	const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);

	if (res.ok) {
		return await res.json();
	}

	return [];
}

export async function fetchUserTodos(userId: number) {
	const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/todos`);

	if (res.ok) {
		return await res.json();
	}

	return [];
}
