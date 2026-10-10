import EditPostForm from './EditPostForm'
import { auth } from '@/auth'
import { getOwnPost } from '@/lib/ownPost'
import { notFound } from 'next/navigation'

type Params = {
	params: Promise<{ id: string }>
}

export default async function EditPage({ params} : Params) {
	const session = await auth()
	const userId = session?.user?.id;
	if (!session?.user?.email || !userId) {
		throw new Error("不正なリクエストです");
	}

	const { id } = await params // paramsはPromise型で定義しつつawaitで非同期処理
	const post = await getOwnPost(userId, id) // DBからid指定して情報取得

	if (!post) {
		notFound()
	}

	return (
		<EditPostForm post={post} />

	)
}
