export default function ({ store, route, redirect }) {
  if (!store.$auth.loggedIn) {
    if (route.path !== '/login') {
      return redirect('/login')
    }
  }
}