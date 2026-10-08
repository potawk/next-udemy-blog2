'use server';
import { signIn } from '@/auth'; // signIn関数のインポート
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

function getAuthErrorType(error: unknown) {
	if (error instanceof AuthError) return error.type
	if (
		typeof error === 'object' &&
		error !== null &&
		'type' in error &&
		typeof error.type === 'string'
	) {
		return error.type
	}
	return undefined
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false,
    });
    
    redirect('/dashboard');

  } catch (error) {
    // next-auth の AuthError はバンドル境界をまたぐと instanceof が外れる
    switch (getAuthErrorType(error)) {
      case 'CredentialsSignin':
        return 'メールアドレスまたはパスワードが正しくありません。';
      case undefined:
        throw error;
      default:
        return 'エラーが発生しました。';
    }
	}
}