/**
 * 認証が必要なページで未認証の場合はリダイレクトする
 */
export default async function({ store, redirect, route }) {
  if (!store.state.authUser && (route.path.indexOf("/api") !== 0)){
    redirect("/login");
  }
}